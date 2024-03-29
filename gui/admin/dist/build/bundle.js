var app = (function () {
    'use strict';

    /**
     * Hot module replacement for Svelte in the Wild
     *
     * @export
     * @param {object} Component Svelte component
     * @param {object} [options={ target: document.body }] Options for the Svelte component
     * @param {string} [id='hmr'] ID for the component container
     * @param {string} [eventName='app-loaded'] Name of the event that triggers replacement of previous component
     * @returns
     */
    function HMR(Component, options = { target: document.body }, id = 'hmr', eventName = 'app-loaded') {
        const oldContainer = document.getElementById(id);

        // Create the new (temporarily hidden) component container
        const appContainer = document.createElement("div");
        if (oldContainer) appContainer.style.visibility = 'hidden';
        else appContainer.setAttribute('id', id); //ssr doesn't get an event, so we set the id now

        // Attach it to the target element
        options.target.appendChild(appContainer);

        // Wait for the app to load before replacing the component
        addEventListener(eventName, replaceComponent);

        function replaceComponent() {
            if (oldContainer) oldContainer.remove();
            // Show our component and take over the ID of the old container
            appContainer.style.visibility = 'initial';
            // delete (appContainer.style.visibility)
            appContainer.setAttribute('id', id);
        }

        return new Component({
            ...options,
            target: appContainer
        });
    }

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function claim_element(nodes, name, attributes, svg) {
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            if (node.nodeName === name) {
                let j = 0;
                const remove = [];
                while (j < node.attributes.length) {
                    const attribute = node.attributes[j++];
                    if (!attributes[attribute.name]) {
                        remove.push(attribute.name);
                    }
                }
                for (let k = 0; k < remove.length; k++) {
                    node.removeAttribute(remove[k]);
                }
                return nodes.splice(i, 1)[0];
            }
        }
        return svg ? svg_element(name) : element(name);
    }
    function claim_text(nodes, data) {
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            if (node.nodeType === 3) {
                node.data = '' + data;
                return nodes.splice(i, 1)[0];
            }
        }
        return text(data);
    }
    function claim_space(nodes) {
        return claim_text(nodes, ' ');
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.wholeText !== data)
            text.data = data;
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    class HtmlTag {
        constructor(anchor = null) {
            this.a = anchor;
            this.e = this.n = null;
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.h(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                info.blocks[i] = null;
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function claim_component(block, parent_nodes) {
        block && block.l(parent_nodes);
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init$1(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe,
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const MATCH_PARAM = RegExp(/\:([^/()]+)/g);

    function handleScroll (element) {
      if (navigator.userAgent.includes('jsdom')) return false
      scrollAncestorsToTop(element);
      handleHash();
    }

    function handleHash () {
      if (navigator.userAgent.includes('jsdom')) return false
      const { hash } = window.location;
      if (hash) {
        const validElementIdRegex = /^[A-Za-z]+[\w\-\:\.]*$/;
        if (validElementIdRegex.test(hash.substring(1))) {
          const el = document.querySelector(hash);
          if (el) el.scrollIntoView();
        }
      }
    }

    function scrollAncestorsToTop (element) {
      if (
        element &&
        element.scrollTo &&
        element.dataset.routify !== 'scroll-lock' &&
        element.dataset['routify-scroll'] !== 'lock'
      ) {
        element.style['scroll-behavior'] = 'auto';
        element.scrollTo({ top: 0, behavior: 'auto' });
        element.style['scroll-behavior'] = '';
        scrollAncestorsToTop(element.parentElement);
      }
    }

    const pathToRegex = (str, recursive) => {
      const suffix = recursive ? '' : '/?$'; //fallbacks should match recursively
      str = str.replace(/\/_fallback?$/, '(/|$)');
      str = str.replace(/\/index$/, '(/index)?'); //index files should be matched even if not present in url
      str = str.replace(MATCH_PARAM, '([^/]+)') + suffix;
      return str
    };

    const pathToParamKeys = string => {
      const paramsKeys = [];
      let matches;
      while ((matches = MATCH_PARAM.exec(string))) paramsKeys.push(matches[1]);
      return paramsKeys
    };

    const pathToRank = ({ path }) => {
      return path
        .split('/')
        .filter(Boolean)
        .map(str => (str === '_fallback' ? 'A' : str.startsWith(':') ? 'B' : 'C'))
        .join('')
    };

    let warningSuppressed = false;

    /* eslint no-console: 0 */
    function suppressWarnings () {
      if (warningSuppressed) return
      const consoleWarn = console.warn;
      console.warn = function (msg, ...msgs) {
        const ignores = [
          "was created with unknown prop 'scoped'",
          "was created with unknown prop 'scopedSync'",
        ];
        if (!ignores.find(iMsg => msg.includes(iMsg)))
          return consoleWarn(msg, ...msgs)
      };
      warningSuppressed = true;
    }

    function currentLocation () {
      const pathMatch = window.location.search.match(/__routify_path=([^&]+)/);
      const prefetchMatch = window.location.search.match(/__routify_prefetch=\d+/);
      window.routify = window.routify || {};
      window.routify.prefetched = prefetchMatch ? true : false;
      const path = pathMatch && pathMatch[1].replace(/[#?].+/, ''); // strip any thing after ? and #
      return path || window.location.pathname
    }

    window.routify = window.routify || {};

    /** @type {import('svelte/store').Writable<RouteNode>} */
    const route = writable(null); // the actual route being rendered

    /** @type {import('svelte/store').Writable<RouteNode[]>} */
    const routes$1 = writable([]); // all routes
    routes$1.subscribe(routes => (window.routify.routes = routes));

    let rootContext = writable({ component: { params: {} } });

    /** @type {import('svelte/store').Writable<RouteNode>} */
    const urlRoute = writable(null);  // the route matching the url

    /** @type {import('svelte/store').Writable<String>} */
    const basepath = (() => {
        const { set, subscribe } = writable("");

        return {
            subscribe,
            set(value) {
                if (value.match(/^[/(]/))
                    set(value);
                else console.warn('Basepaths must start with / or (');
            },
            update() { console.warn('Use assignment or set to update basepaths.'); }
        }
    })();

    const location$1 = derived( // the part of the url matching the basepath
        [basepath, urlRoute],
        ([$basepath, $route]) => {
            const [, base, path] = currentLocation().match(`^(${$basepath})(${$route.regex})`) || [];
            return { base, path }
        }
    );

    function onAppLoaded({ path, metatags }) {
        metatags.update();
        const prefetchMatch = window.location.search.match(/__routify_prefetch=(\d+)/);
        const prefetchId = prefetchMatch && prefetchMatch[1];

        dispatchEvent(new CustomEvent('app-loaded'));
        parent.postMessage({
            msg: 'app-loaded',
            prefetched: window.routify.prefetched,
            path,
            prefetchId
        }, "*");
        window['routify'].appLoaded = true;
    }

    var defaultConfig = {
        queryHandler: {
            parse: search => fromEntries(new URLSearchParams(search)),
            stringify: params => '?' + (new URLSearchParams(params)).toString()
        }
    };


    function fromEntries(iterable) {
        return [...iterable].reduce((obj, [key, val]) => {
            obj[key] = val;
            return obj
        }, {})
    }

    /**
     * @param {string} url
     * @return {ClientNode}
     */
    function urlToRoute(url) {
        /** @type {RouteNode[]} */
        const routes = get_store_value(routes$1);
        const basepath$1 = get_store_value(basepath);
        const route = routes.find(route => url.match(`^${basepath$1}${route.regex}`));
        if (!route)
            throw new Error(
                `Route could not be found for "${url}".`
            )

        const [, base] = url.match(`^(${basepath$1})${route.regex}`);
        const path = url.slice(base.length);

        if (defaultConfig.queryHandler)
            route.params = defaultConfig.queryHandler.parse(window.location.search);

        if (route.paramKeys) {
            const layouts = layoutByPos(route.layouts);
            const fragments = path.split('/').filter(Boolean);
            const routeProps = getRouteProps(route.path);

            routeProps.forEach((prop, i) => {
                if (prop) {
                    route.params[prop] = fragments[i];
                    if (layouts[i]) layouts[i].param = { [prop]: fragments[i] };
                    else route.param = { [prop]: fragments[i] };
                }
            });
        }

        route.leftover = url.replace(new RegExp(base + route.regex), '');

        return route
    }


    /**
     * @param {array} layouts
     */
    function layoutByPos(layouts) {
        const arr = [];
        layouts.forEach(layout => {
            arr[layout.path.split('/').filter(Boolean).length - 1] = layout;
        });
        return arr
    }


    /**
     * @param {string} url
     */
    function getRouteProps(url) {
        return url
            .split('/')
            .filter(Boolean)
            .map(f => f.match(/\:(.+)/))
            .map(f => f && f[1])
    }

    /* node_modules\@sveltech\routify\runtime\Prefetcher.svelte generated by Svelte v3.24.1 */

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (93:2) {#each $actives as prefetch (prefetch.options.prefetch)}
    function create_each_block$9(key_1, ctx) {
    	let iframe;
    	let iframe_src_value;

    	return {
    		key: key_1,
    		first: null,
    		c() {
    			iframe = element("iframe");
    			this.h();
    		},
    		l(nodes) {
    			iframe = claim_element(nodes, "IFRAME", {
    				src: true,
    				frameborder: true,
    				title: true
    			});

    			children(iframe).forEach(detach);
    			this.h();
    		},
    		h() {
    			if (iframe.src !== (iframe_src_value = /*prefetch*/ ctx[1].url)) attr(iframe, "src", iframe_src_value);
    			attr(iframe, "frameborder", "0");
    			attr(iframe, "title", "routify prefetcher");
    			this.first = iframe;
    		},
    		m(target, anchor) {
    			insert(target, iframe, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*$actives*/ 1 && iframe.src !== (iframe_src_value = /*prefetch*/ ctx[1].url)) {
    				attr(iframe, "src", iframe_src_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(iframe);
    		}
    	};
    }

    function create_fragment$t(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_value = /*$actives*/ ctx[0];
    	const get_key = ctx => /*prefetch*/ ctx[1].options.prefetch;

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$9(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$9(key, child_ctx));
    	}

    	return {
    		c() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			this.h();
    		},
    		l(nodes) {
    			div = claim_element(nodes, "DIV", { id: true, style: true });
    			var div_nodes = children(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(div_nodes);
    			}

    			div_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(div, "id", "__routify_iframes");
    			set_style(div, "display", "none");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*$actives*/ 1) {
    				const each_value = /*$actives*/ ctx[0];
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, destroy_block, create_each_block$9, null, get_each_context$9);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};
    }

    const iframeNum = 2;

    /** stores and subscriptions */
    const queue = writable([]);

    const actives = derived(queue, q => q.slice(0, iframeNum));

    actives.subscribe(actives => actives.forEach(({ options }) => {
    	setTimeout(() => removeFromQueue(options.prefetch), options.timeout);
    }));

    /**
     * @param {number|MessageEvent} idOrEvent
     */
    function removeFromQueue(idOrEvent) {
    	const id = idOrEvent.data ? idOrEvent.data.prefetchId : idOrEvent;
    	if (!id) return null;
    	const entry = get_store_value(queue).find(entry => entry && entry.options.prefetch == id);

    	// removeFromQueue is called by both eventListener and timeout,
    	// but we can only remove the item once
    	if (entry) {
    		const { gracePeriod } = entry.options;
    		const gracePromise = new Promise(resolve => setTimeout(resolve, gracePeriod));

    		const idlePromise = new Promise(resolve => {
    				window.requestIdleCallback
    				? window.requestIdleCallback(resolve)
    				: setTimeout(resolve, gracePeriod + 1000);
    			});

    		Promise.all([gracePromise, idlePromise]).then(() => {
    			queue.update(q => q.filter(q => q.options.prefetch != id));
    		});
    	}
    }

    // Listen to message from child window
    addEventListener("message", removeFromQueue, false);

    function instance$q($$self, $$props, $$invalidate) {
    	let $actives;
    	component_subscribe($$self, actives, $$value => $$invalidate(0, $actives = $$value));
    	return [$actives];
    }

    class Prefetcher extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$1(this, options, instance$q, create_fragment$t, safe_not_equal, {});
    	}
    }

    /// <reference path="../typedef.js" />

    /** @ts-check */
    /**
     * @typedef {Object} RoutifyContext
     * @prop {ClientNode} component
     * @prop {ClientNode} layout
     * @prop {any} componentFile
     *
     *  @returns {import('svelte/store').Readable<RoutifyContext>} */
    function getRoutifyContext() {
      return getContext('routify') || rootContext
    }

    /**
     * @callback AfterPageLoadHelper
     * @param {function} callback
     *
     * @typedef {import('svelte/store').Readable<AfterPageLoadHelper> & {_hooks:Array<function>}} AfterPageLoadHelperStore
     * @type {AfterPageLoadHelperStore}
     */
    const afterPageLoad = {
      _hooks: [],
      subscribe: hookHandler
    };

    /**
     * @callback BeforeUrlChangeHelper
     * @param {function} callback
     *
     * @typedef {import('svelte/store').Readable<BeforeUrlChangeHelper> & {_hooks:Array<function>}} BeforeUrlChangeHelperStore
     * @type {BeforeUrlChangeHelperStore}
     **/
    const beforeUrlChange = {
      _hooks: [],
      subscribe: hookHandler
    };

    function hookHandler(listener) {
      const hooks = this._hooks;
      const index = hooks.length;
      listener(callback => { hooks[index] = callback; });
      return () => delete hooks[index]
    }

    /**
     * We have to grab params and leftover from the context and not directly from the store.
     * Otherwise the context is updated before the component is destroyed. *
     * @typedef {Object.<string, *>} ParamsHelper
     * @typedef {import('svelte/store').Readable<ParamsHelper>} ParamsHelperStore
     * @type {ParamsHelperStore}
     **/
    const params = {
      subscribe(run) {
        const ctx = getRoutifyContext();
        return derived(ctx, ctx => ctx.route.params).subscribe(run)
      }
    };

    /**
     * @callback UrlHelper
     * @param {String=} path
     * @param {UrlParams=} params
     * @param {UrlOptions=} options
     * @return {String}
     *
     * @typedef {import('svelte/store').Readable<UrlHelper>} UrlHelperStore
     * @type {UrlHelperStore}
     * */
    const url = {
      subscribe(listener) {
        const ctx = getRoutifyContext();
        return derived(
          [ctx, route, routes$1, location$1],
          args => makeUrlHelper(...args)
        ).subscribe(
          listener
        )
      }
    };

    /**
     * @param {{component: ClientNode}} $ctx
     * @param {RouteNode} $oldRoute
     * @param {RouteNode[]} $routes
     * @param {{base: string, path: string}} $location
     * @returns {UrlHelper}
     */
    function makeUrlHelper($ctx, $oldRoute, $routes, $location) {
      return function url(path, params, options) {
        const { component } = $ctx;
        path = path || './';

        const strict = options && options.strict !== false;
        if (!strict) path = path.replace(/index$/, '');

        if (path.match(/^\.\.?\//)) {
          //RELATIVE PATH
          let [, breadcrumbs, relativePath] = path.match(/^([\.\/]+)(.*)/);
          let dir = component.path.replace(/\/$/, '');
          const traverse = breadcrumbs.match(/\.\.\//g) || [];
          traverse.forEach(() => dir = dir.replace(/\/[^\/]+\/?$/, ''));
          path = `${dir}/${relativePath}`.replace(/\/$/, '');

        } else if (path.match(/^\//)) ; else {
          // NAMED PATH
          const matchingRoute = $routes.find(route => route.meta.name === path);
          if (matchingRoute) path = matchingRoute.shortPath;
        }

        /** @type {Object<string, *>} Parameters */
        const allParams = Object.assign({}, $oldRoute.params, component.params, params);
        let pathWithParams = path;
        for (const [key, value] of Object.entries(allParams)) {
          pathWithParams = pathWithParams.replace(`:${key}`, value);
        }

        const fullPath = $location.base + pathWithParams + _getQueryString(path, params);
        return fullPath.replace(/\?$/, '')
      }
    }

    /**
     *
     * @param {string} path
     * @param {object} params
     */
    function _getQueryString(path, params) {
      if (!defaultConfig.queryHandler) return ""
      const pathParamKeys = pathToParamKeys(path);
      const queryParams = {};
      if (params) Object.entries(params).forEach(([key, value]) => {
        if (!pathParamKeys.includes(key))
          queryParams[key] = value;
      });
      return defaultConfig.queryHandler.stringify(queryParams)
    }



    const _metatags = {
      props: {},
      templates: {},
      services: {
        plain: { propField: 'name', valueField: 'content' },
        twitter: { propField: 'name', valueField: 'content' },
        og: { propField: 'property', valueField: 'content' },
      },
      plugins: [
        {
          name: 'applyTemplate',
          condition: () => true,
          action: (prop, value) => {
            const template = _metatags.getLongest(_metatags.templates, prop) || (x => x);
            return [prop, template(value)]
          }
        },
        {
          name: 'createMeta',
          condition: () => true,
          action(prop, value) {
            _metatags.writeMeta(prop, value);
          }
        },
        {
          name: 'createOG',
          condition: prop => !prop.match(':'),
          action(prop, value) {
            _metatags.writeMeta(`og:${prop}`, value);
          }
        },
        {
          name: 'createTitle',
          condition: prop => prop === 'title',
          action(prop, value) {
            document.title = value;
          }
        }
      ],
      getLongest(repo, name) {
        const providers = repo[name];
        if (providers) {
          const currentPath = get_store_value(route).path;
          const allPaths = Object.keys(repo[name]);
          const matchingPaths = allPaths.filter(path => currentPath.includes(path));

          const longestKey = matchingPaths.sort((a, b) => b.length - a.length)[0];

          return providers[longestKey]
        }
      },
      writeMeta(prop, value) {
        const head = document.getElementsByTagName('head')[0];
        const match = prop.match(/(.+)\:/);
        const serviceName = match && match[1] || 'plain';
        const { propField, valueField } = metatags.services[serviceName] || metatags.services.plain;
        const oldElement = document.querySelector(`meta[${propField}='${prop}']`);
        if (oldElement) oldElement.remove();

        const newElement = document.createElement('meta');
        newElement.setAttribute(propField, prop);
        newElement.setAttribute(valueField, value);
        newElement.setAttribute('data-origin', 'routify');
        head.appendChild(newElement);
      },
      set(prop, value) {
        _metatags.plugins.forEach(plugin => {
          if (plugin.condition(prop, value))
            [prop, value] = plugin.action(prop, value) || [prop, value];
        });
      },
      clear() {
        const oldElement = document.querySelector(`meta`);
        if (oldElement) oldElement.remove();
      },
      template(name, fn) {
        const origin = _metatags.getOrigin();
        _metatags.templates[name] = _metatags.templates[name] || {};
        _metatags.templates[name][origin] = fn;
      },
      update() {
        Object.keys(_metatags.props).forEach((prop) => {
          let value = (_metatags.getLongest(_metatags.props, prop));
          _metatags.plugins.forEach(plugin => {
            if (plugin.condition(prop, value)) {
              [prop, value] = plugin.action(prop, value) || [prop, value];

            }
          });
        });
      },
      batchedUpdate() {
        if (!_metatags._pendingUpdate) {
          _metatags._pendingUpdate = true;
          setTimeout(() => {
            _metatags._pendingUpdate = false;
            this.update();
          });
        }
      },
      _updateQueued: false,
      getOrigin() {
        const routifyCtx = getRoutifyContext();
        return routifyCtx && get_store_value(routifyCtx).path || '/'
      },
      _pendingUpdate: false
    };


    /**
     * metatags
     * @prop {Object.<string, string>}
     */
    const metatags = new Proxy(_metatags, {
      set(target, name, value, receiver) {
        const { props, getOrigin } = target;

        if (Reflect.has(target, name))
          Reflect.set(target, name, value, receiver);
        else {
          props[name] = props[name] || {};
          props[name][getOrigin()] = value;
        }

        if (window['routify'].appLoaded)
          target.batchedUpdate();
        return true
      }
    });

    ((function () {
      const store = writable(false);
      beforeUrlChange.subscribe(fn => fn(event => {
        store.set(true);
        return true
      }));

      afterPageLoad.subscribe(fn => fn(event => store.set(false)));

      return store
    }))();

    /* node_modules\@sveltech\routify\runtime\Route.svelte generated by Svelte v3.24.1 */

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i].component;
    	child_ctx[20] = list[i].componentFile;
    	return child_ctx;
    }

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i].component;
    	child_ctx[20] = list[i].componentFile;
    	return child_ctx;
    }

    // (120:0) {#if $context}
    function create_if_block_1$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$2, create_if_block_3$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$context*/ ctx[6].component.isLayout === false) return 0;
    		if (/*remainingLayouts*/ ctx[5].length) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	return {
    		c() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l(nodes) {
    			if (if_block) if_block.l(nodes);
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    // (132:36)
    function create_if_block_3$2(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value_1 = [/*$context*/ ctx[6]];
    	const get_key = ctx => /*component*/ ctx[19].path;

    	for (let i = 0; i < 1; i += 1) {
    		let child_ctx = get_each_context_1$1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1$1(key, child_ctx));
    	}

    	return {
    		c() {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l(nodes) {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].l(nodes);
    			}

    			each_1_anchor = empty();
    		},
    		m(target, anchor) {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			if (dirty & /*$context, scoped, scopedSync, layout, remainingLayouts, decorator, Decorator, scopeToChild*/ 100663415) {
    				const each_value_1 = [/*$context*/ ctx[6]];
    				group_outros();
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block_1$1, each_1_anchor, get_each_context_1$1);
    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;

    			for (let i = 0; i < 1; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o(local) {
    			for (let i = 0; i < 1; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d(detaching) {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach(each_1_anchor);
    		}
    	};
    }

    // (121:2) {#if $context.component.isLayout === false}
    function create_if_block_2$2(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = [/*$context*/ ctx[6]];
    	const get_key = ctx => /*component*/ ctx[19].path;

    	for (let i = 0; i < 1; i += 1) {
    		let child_ctx = get_each_context$8(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$8(key, child_ctx));
    	}

    	return {
    		c() {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l(nodes) {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].l(nodes);
    			}

    			each_1_anchor = empty();
    		},
    		m(target, anchor) {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			if (dirty & /*$context, scoped, scopedSync, layout*/ 85) {
    				const each_value = [/*$context*/ ctx[6]];
    				group_outros();
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$8, each_1_anchor, get_each_context$8);
    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;

    			for (let i = 0; i < 1; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o(local) {
    			for (let i = 0; i < 1; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d(detaching) {
    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach(each_1_anchor);
    		}
    	};
    }

    // (134:6) <svelte:component         this={componentFile}         let:scoped={scopeToChild}         let:decorator         {scoped}         {scopedSync}         {...layout.param || {}}>
    function create_default_slot(ctx) {
    	let route_1;
    	let t;
    	let current;

    	route_1 = new Route({
    			props: {
    				layouts: [.../*remainingLayouts*/ ctx[5]],
    				Decorator: typeof /*decorator*/ ctx[26] !== "undefined"
    				? /*decorator*/ ctx[26]
    				: /*Decorator*/ ctx[1],
    				childOfDecorator: /*layout*/ ctx[4].isDecorator,
    				scoped: {
    					.../*scoped*/ ctx[0],
    					.../*scopeToChild*/ ctx[25]
    				}
    			}
    		});

    	return {
    		c() {
    			create_component(route_1.$$.fragment);
    			t = space();
    		},
    		l(nodes) {
    			claim_component(route_1.$$.fragment, nodes);
    			t = claim_space(nodes);
    		},
    		m(target, anchor) {
    			mount_component(route_1, target, anchor);
    			insert(target, t, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const route_1_changes = {};
    			if (dirty & /*remainingLayouts*/ 32) route_1_changes.layouts = [.../*remainingLayouts*/ ctx[5]];

    			if (dirty & /*decorator, Decorator*/ 67108866) route_1_changes.Decorator = typeof /*decorator*/ ctx[26] !== "undefined"
    			? /*decorator*/ ctx[26]
    			: /*Decorator*/ ctx[1];

    			if (dirty & /*layout*/ 16) route_1_changes.childOfDecorator = /*layout*/ ctx[4].isDecorator;

    			if (dirty & /*scoped, scopeToChild*/ 33554433) route_1_changes.scoped = {
    				.../*scoped*/ ctx[0],
    				.../*scopeToChild*/ ctx[25]
    			};

    			route_1.$set(route_1_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(route_1.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(route_1.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(route_1, detaching);
    			if (detaching) detach(t);
    		}
    	};
    }

    // (133:4) {#each [$context] as { component, componentFile }
    function create_each_block_1$1(key_1, ctx) {
    	let first;
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ scoped: /*scoped*/ ctx[0] },
    		{ scopedSync: /*scopedSync*/ ctx[2] },
    		/*layout*/ ctx[4].param || {}
    	];

    	var switch_value = /*componentFile*/ ctx[20];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: {
    				default: [
    					create_default_slot,
    					({ scoped: scopeToChild, decorator }) => ({ 25: scopeToChild, 26: decorator }),
    					({ scoped: scopeToChild, decorator }) => (scopeToChild ? 33554432 : 0) | (decorator ? 67108864 : 0)
    				]
    			},
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return { props: switch_instance_props };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	return {
    		key: key_1,
    		first: null,
    		c() {
    			first = empty();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    			this.h();
    		},
    		l(nodes) {
    			first = empty();
    			if (switch_instance) claim_component(switch_instance.$$.fragment, nodes);
    			switch_instance_anchor = empty();
    			this.h();
    		},
    		h() {
    			this.first = first;
    		},
    		m(target, anchor) {
    			insert(target, first, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*scoped, scopedSync, layout*/ 21)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*scoped*/ 1 && { scoped: /*scoped*/ ctx[0] },
    					dirty & /*scopedSync*/ 4 && { scopedSync: /*scopedSync*/ ctx[2] },
    					dirty & /*layout*/ 16 && get_spread_object(/*layout*/ ctx[4].param || {})
    				])
    			: {};

    			if (dirty & /*$$scope, remainingLayouts, decorator, Decorator, layout, scoped, scopeToChild*/ 234881075) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*componentFile*/ ctx[20])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(first);
    			if (detaching) detach(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};
    }

    // (122:4) {#each [$context] as { component, componentFile }
    function create_each_block$8(key_1, ctx) {
    	let first;
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ scoped: /*scoped*/ ctx[0] },
    		{ scopedSync: /*scopedSync*/ ctx[2] },
    		/*layout*/ ctx[4].param || {}
    	];

    	var switch_value = /*componentFile*/ ctx[20];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return { props: switch_instance_props };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	return {
    		key: key_1,
    		first: null,
    		c() {
    			first = empty();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    			this.h();
    		},
    		l(nodes) {
    			first = empty();
    			if (switch_instance) claim_component(switch_instance.$$.fragment, nodes);
    			switch_instance_anchor = empty();
    			this.h();
    		},
    		h() {
    			this.first = first;
    		},
    		m(target, anchor) {
    			insert(target, first, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*scoped, scopedSync, layout*/ 21)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*scoped*/ 1 && { scoped: /*scoped*/ ctx[0] },
    					dirty & /*scopedSync*/ 4 && { scopedSync: /*scopedSync*/ ctx[2] },
    					dirty & /*layout*/ 16 && get_spread_object(/*layout*/ ctx[4].param || {})
    				])
    			: {};

    			if (switch_value !== (switch_value = /*componentFile*/ ctx[20])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(first);
    			if (detaching) detach(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};
    }

    // (152:0) {#if !parentElement}
    function create_if_block$7(ctx) {
    	let span;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			span = element("span");
    		},
    		l(nodes) {
    			span = claim_element(nodes, "SPAN", {});
    			children(span).forEach(detach);
    		},
    		m(target, anchor) {
    			insert(target, span, anchor);

    			if (!mounted) {
    				dispose = action_destroyer(/*setParent*/ ctx[8].call(null, span));
    				mounted = true;
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(span);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function create_fragment$s(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*$context*/ ctx[6] && create_if_block_1$3(ctx);
    	let if_block1 = !/*parentElement*/ ctx[3] && create_if_block$7(ctx);

    	return {
    		c() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l(nodes) {
    			if (if_block0) if_block0.l(nodes);
    			t = claim_space(nodes);
    			if (if_block1) if_block1.l(nodes);
    			if_block1_anchor = empty();
    		},
    		m(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (/*$context*/ ctx[6]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*$context*/ 64) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!/*parentElement*/ ctx[3]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block$7(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach(if_block1_anchor);
    		}
    	};
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let $route;
    	let $context;
    	component_subscribe($$self, route, $$value => $$invalidate(14, $route = $$value));
    	let { layouts = [] } = $$props;
    	let { scoped = {} } = $$props;
    	let { Decorator = null } = $$props;
    	let { childOfDecorator = false } = $$props;
    	let { isRoot = false } = $$props;
    	let scopedSync = {};
    	let isDecorator = false;

    	/** @type {HTMLElement} */
    	let parentElement;

    	/** @type {LayoutOrDecorator} */
    	let layout = null;

    	/** @type {LayoutOrDecorator[]} */
    	let remainingLayouts = [];

    	const context = writable(null);
    	component_subscribe($$self, context, value => $$invalidate(6, $context = value));

    	/** @type {import("svelte/store").Writable<Context>} */
    	const parentContextStore = getContext("routify");

    	isDecorator = Decorator && !childOfDecorator;
    	setContext("routify", context);

    	/** @param {HTMLElement} el */
    	function setParent(el) {
    		$$invalidate(3, parentElement = el.parentElement);
    	}

    	/** @param {SvelteComponent} componentFile */
    	function onComponentLoaded(componentFile) {
    		/** @type {Context} */
    		const parentContext = get_store_value(parentContextStore);

    		$$invalidate(2, scopedSync = { ...scoped });
    		if (remainingLayouts.length === 0) onLastComponentLoaded();

    		const ctx = {
    			layout: isDecorator ? parentContext.layout : layout,
    			component: layout,
    			route: $route,
    			componentFile,
    			child: isDecorator
    			? parentContext.child
    			: get_store_value(context) && get_store_value(context).child
    		};

    		context.set(ctx);
    		if (isRoot) rootContext.set(ctx);

    		if (parentContext && !isDecorator) parentContextStore.update(store => {
    			store.child = layout || store.child;
    			return store;
    		});
    	}

    	/**  @param {LayoutOrDecorator} layout */
    	function setComponent(layout) {
    		let PendingComponent = layout.component();
    		if (PendingComponent instanceof Promise) PendingComponent.then(onComponentLoaded); else onComponentLoaded(PendingComponent);
    	}

    	async function onLastComponentLoaded() {
    		afterPageLoad._hooks.forEach(hook => hook(layout.api));
    		await tick();
    		handleScroll(parentElement);

    		if (!window["routify"].appLoaded) {
    			const pagePath = $context.component.path;
    			const routePath = $route.path;
    			const isOnCurrentRoute = pagePath === routePath; //maybe we're getting redirected

    			// Let everyone know the last child has rendered
    			if (!window["routify"].stopAutoReady && isOnCurrentRoute) {
    				onAppLoaded({ path: pagePath, metatags });
    			}
    		}
    	}

    	$$self.$$set = $$props => {
    		if ("layouts" in $$props) $$invalidate(9, layouts = $$props.layouts);
    		if ("scoped" in $$props) $$invalidate(0, scoped = $$props.scoped);
    		if ("Decorator" in $$props) $$invalidate(1, Decorator = $$props.Decorator);
    		if ("childOfDecorator" in $$props) $$invalidate(10, childOfDecorator = $$props.childOfDecorator);
    		if ("isRoot" in $$props) $$invalidate(11, isRoot = $$props.isRoot);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isDecorator, Decorator, layouts*/ 4610) {
    			if (isDecorator) {
    				const decoratorLayout = {
    					component: () => Decorator,
    					path: `${layouts[0].path}__decorator`,
    					isDecorator: true
    				};

    				$$invalidate(9, layouts = [decoratorLayout, ...layouts]);
    			}
    		}

    		if ($$self.$$.dirty & /*layouts*/ 512) {
    			$$invalidate(4, [layout, ...remainingLayouts] = layouts, layout, ((($$invalidate(5, remainingLayouts), $$invalidate(9, layouts)), $$invalidate(12, isDecorator)), $$invalidate(1, Decorator)));
    		}

    		if ($$self.$$.dirty & /*layout*/ 16) {
    			setComponent(layout);
    		}
    	};

    	return [
    		scoped,
    		Decorator,
    		scopedSync,
    		parentElement,
    		layout,
    		remainingLayouts,
    		$context,
    		context,
    		setParent,
    		layouts,
    		childOfDecorator,
    		isRoot
    	];
    }

    class Route extends SvelteComponent {
    	constructor(options) {
    		super();

    		init$1(this, options, instance$p, create_fragment$s, safe_not_equal, {
    			layouts: 9,
    			scoped: 0,
    			Decorator: 1,
    			childOfDecorator: 10,
    			isRoot: 11
    		});
    	}
    }

    function init(routes, callback) {
      /** @type { ClientNode | false } */
      let lastRoute = false;

      function updatePage(proxyToUrl, shallow) {
        const url = proxyToUrl || currentLocation();
        const route$1 = urlToRoute(url);
        const currentRoute = shallow && urlToRoute(currentLocation());
        const contextRoute = currentRoute || route$1;
        const layouts = [...contextRoute.layouts, route$1];
        if (lastRoute) delete lastRoute.last; //todo is a page component the right place for the previous route?
        route$1.last = lastRoute;
        lastRoute = route$1;

        //set the route in the store
        if (!proxyToUrl)
          urlRoute.set(route$1);
        route.set(route$1);

        //run callback in Router.svelte
        callback(layouts);
      }

      const destroy = createEventListeners(updatePage);

      return { updatePage, destroy }
    }

    /**
     * svelte:window events doesn't work on refresh
     * @param {Function} updatePage
     */
    function createEventListeners(updatePage) {
    ['pushState', 'replaceState'].forEach(eventName => {
        const fn = history[eventName];
        history[eventName] = async function (state = {}, title, url) {
          const { id, path, params } = get_store_value(route);
          state = { id, path, params, ...state };
          const event = new Event(eventName.toLowerCase());
          Object.assign(event, { state, title, url });

          if (await runHooksBeforeUrlChange(event)) {
            fn.apply(this, [state, title, url]);
            return dispatchEvent(event)
          }
        };
      });

      let _ignoreNextPop = false;

      const listeners = {
        click: handleClick,
        pushstate: () => updatePage(),
        replacestate: () => updatePage(),
        popstate: async event => {
          if (_ignoreNextPop)
            _ignoreNextPop = false;
          else {
            if (await runHooksBeforeUrlChange(event)) {
              updatePage();
            } else {
              _ignoreNextPop = true;
              event.preventDefault();
              history.go(1);
            }
          }
        },
      };

      Object.entries(listeners).forEach(args => addEventListener(...args));

      const unregister = () => {
        Object.entries(listeners).forEach(args => removeEventListener(...args));
      };

      return unregister
    }

    function handleClick(event) {
      const el = event.target.closest('a');
      const href = el && el.getAttribute('href');

      if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.shiftKey ||
        event.button ||
        event.defaultPrevented
      )
        return
      if (!href || el.target || el.host !== location.host) return

      event.preventDefault();
      history.pushState({}, '', href);
    }

    async function runHooksBeforeUrlChange(event) {
      const route$1 = get_store_value(route);
      for (const hook of beforeUrlChange._hooks.filter(Boolean)) {
        // return false if the hook returns false
        const result = await hook(event, route$1); //todo remove route from hook. Its API Can be accessed as $page
        if (!result) return false
      }
      return true
    }

    /* node_modules\@sveltech\routify\runtime\Router.svelte generated by Svelte v3.24.1 */

    function create_if_block$6(ctx) {
    	let route_1;
    	let current;

    	route_1 = new Route({
    			props: {
    				layouts: /*layouts*/ ctx[0],
    				isRoot: true
    			}
    		});

    	return {
    		c() {
    			create_component(route_1.$$.fragment);
    		},
    		l(nodes) {
    			claim_component(route_1.$$.fragment, nodes);
    		},
    		m(target, anchor) {
    			mount_component(route_1, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const route_1_changes = {};
    			if (dirty & /*layouts*/ 1) route_1_changes.layouts = /*layouts*/ ctx[0];
    			route_1.$set(route_1_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(route_1.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(route_1.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(route_1, detaching);
    		}
    	};
    }

    function create_fragment$r(ctx) {
    	let t;
    	let prefetcher;
    	let current;
    	let if_block = /*layouts*/ ctx[0] && /*$route*/ ctx[1] !== null && create_if_block$6(ctx);
    	prefetcher = new Prefetcher({});

    	return {
    		c() {
    			if (if_block) if_block.c();
    			t = space();
    			create_component(prefetcher.$$.fragment);
    		},
    		l(nodes) {
    			if (if_block) if_block.l(nodes);
    			t = claim_space(nodes);
    			claim_component(prefetcher.$$.fragment, nodes);
    		},
    		m(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert(target, t, anchor);
    			mount_component(prefetcher, target, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (/*layouts*/ ctx[0] && /*$route*/ ctx[1] !== null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*layouts, $route*/ 3) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(prefetcher.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			transition_out(prefetcher.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach(t);
    			destroy_component(prefetcher, detaching);
    		}
    	};
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let $route;
    	component_subscribe($$self, route, $$value => $$invalidate(1, $route = $$value));
    	let { routes } = $$props;
    	let { config = {} } = $$props;
    	let layouts;
    	let navigator;
    	window.routify = window.routify || {};
    	window.routify.inBrowser = !window.navigator.userAgent.match("jsdom");

    	Object.entries(config).forEach(([key, value]) => {
    		defaultConfig[key] = value;
    	});

    	suppressWarnings();
    	const updatePage = (...args) => navigator && navigator.updatePage(...args);
    	setContext("routifyupdatepage", updatePage);
    	const callback = res => $$invalidate(0, layouts = res);

    	const cleanup = () => {
    		if (!navigator) return;
    		navigator.destroy();
    		navigator = null;
    	};

    	let initTimeout = null;

    	// init is async to prevent a horrible bug that completely disable reactivity
    	// in the host component -- something like the component's update function is
    	// called before its fragment is created, and since the component is then seen
    	// as already dirty, it is never scheduled for update again, and remains dirty
    	// forever... I failed to isolate the precise conditions for the bug, but the
    	// faulty update is triggered by a change in the route store, and so offseting
    	// store initialization by one tick gives the host component some time to
    	// create its fragment. The root cause it probably a bug in Svelte with deeply
    	// intertwinned store and reactivity.
    	const doInit = () => {
    		clearTimeout(initTimeout);

    		initTimeout = setTimeout(() => {
    			cleanup();
    			navigator = init(routes, callback);
    			routes$1.set(routes);
    			navigator.updatePage();
    		});
    	};

    	onDestroy(cleanup);

    	$$self.$$set = $$props => {
    		if ("routes" in $$props) $$invalidate(2, routes = $$props.routes);
    		if ("config" in $$props) $$invalidate(3, config = $$props.config);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*routes*/ 4) {
    			if (routes) doInit();
    		}
    	};

    	return [layouts, $route, routes, config];
    }

    class Router extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$1(this, options, instance$o, create_fragment$r, safe_not_equal, { routes: 2, config: 3 });
    	}
    }

    /**
     * Node payload
     * @typedef {Object} NodePayload
     * @property {RouteNode=} file current node
     * @property {RouteNode=} parent parent of the current node
     * @property {StateObject=} state state shared by every node in the walker
     * @property {Object=} scope scope inherited by descendants in the scope
     *
     * State Object
     * @typedef {Object} StateObject
     * @prop {TreePayload=} treePayload payload from the tree
     *
     * Node walker proxy
     * @callback NodeWalkerProxy
     * @param {NodePayload} NodePayload
     */


    /**
     * Node middleware
     * @description Walks through the nodes of a tree
     * @example middleware = createNodeMiddleware(payload => {payload.file.name = 'hello'})(treePayload))
     * @param {NodeWalkerProxy} fn
     */
    function createNodeMiddleware(fn) {

        /**
         * NodeMiddleware payload receiver
         * @param {TreePayload} payload
         */
        const inner = async function execute(payload) {
            return await nodeMiddleware(payload.tree, fn, { state: { treePayload: payload } })
        };

        /**
         * NodeMiddleware sync payload receiver
         * @param {TreePayload} payload
         */
        inner.sync = function executeSync(payload) {
            return nodeMiddlewareSync(payload.tree, fn, { state: { treePayload: payload } })
        };

        return inner
    }

    /**
     * Node walker
     * @param {Object} file mutable file
     * @param {NodeWalkerProxy} fn function to be called for each file
     * @param {NodePayload=} payload
     */
    async function nodeMiddleware(file, fn, payload) {
        const { state, scope, parent } = payload || {};
        payload = {
            file,
            parent,
            state: state || {},            //state is shared by all files in the walk
            scope: clone(scope || {}),     //scope is inherited by descendants
        };

        await fn(payload);

        if (file.children) {
            payload.parent = file;
            await Promise.all(file.children.map(_file => nodeMiddleware(_file, fn, payload)));
        }
        return payload
    }

    /**
     * Node walker (sync version)
     * @param {Object} file mutable file
     * @param {NodeWalkerProxy} fn function to be called for each file
     * @param {NodePayload=} payload
     */
    function nodeMiddlewareSync(file, fn, payload) {
        const { state, scope, parent } = payload || {};
        payload = {
            file,
            parent,
            state: state || {},            //state is shared by all files in the walk
            scope: clone(scope || {}),     //scope is inherited by descendants
        };

        fn(payload);

        if (file.children) {
            payload.parent = file;
            file.children.map(_file => nodeMiddlewareSync(_file, fn, payload));
        }
        return payload
    }


    /**
     * Clone with JSON
     * @param {T} obj
     * @returns {T} JSON cloned object
     * @template T
     */
    function clone(obj) { return JSON.parse(JSON.stringify(obj)) }

    const setRegex = createNodeMiddleware(({ file }) => {
        if (file.isPage || file.isFallback)
            file.regex = pathToRegex(file.path, file.isFallback);
    });
    const setParamKeys = createNodeMiddleware(({ file }) => {
        file.paramKeys = pathToParamKeys(file.path);
    });

    const setShortPath = createNodeMiddleware(({ file }) => {
        if (file.isFallback || file.isIndex)
            file.shortPath = file.path.replace(/\/[^/]+$/, '');
        else file.shortPath = file.path;
    });
    const setRank = createNodeMiddleware(({ file }) => {
        file.ranking = pathToRank(file);
    });


    // todo delete?
    const addMetaChildren = createNodeMiddleware(({ file }) => {
        const node = file;
        const metaChildren = file.meta && file.meta.children || [];
        if (metaChildren.length) {
            node.children = node.children || [];
            node.children.push(...metaChildren.map(meta => ({ isMeta: true, ...meta, meta })));
        }
    });

    const setIsIndexable = createNodeMiddleware(payload => {
        const { file } = payload;
        const { isLayout, isFallback, meta } = file;
        file.isIndexable = !isLayout && !isFallback && meta.index !== false;
        file.isNonIndexable = !file.isIndexable;
    });


    const assignRelations = createNodeMiddleware(({ file, parent }) => {
        Object.defineProperty(file, 'parent', { get: () => parent });
        Object.defineProperty(file, 'nextSibling', { get: () => _getSibling(file, 1) });
        Object.defineProperty(file, 'prevSibling', { get: () => _getSibling(file, -1) });
        Object.defineProperty(file, 'lineage', { get: () => _getLineage(parent) });
    });

    function _getLineage(node, lineage = []){
        if(node){
            lineage.unshift(node);
            _getLineage(node.parent, lineage);
        }
        return lineage
    }

    /**
     *
     * @param {RouteNode} file
     * @param {Number} direction
     */
    function _getSibling(file, direction) {
        if (!file.root) {
            const siblings = file.parent.children.filter(c => c.isIndexable);
            const index = siblings.indexOf(file);
            return siblings[index + direction]
        }
    }

    const assignIndex = createNodeMiddleware(({ file, parent }) => {
        if (file.isIndex) Object.defineProperty(parent, 'index', { get: () => file });
        if (file.isLayout)
            Object.defineProperty(parent, 'layout', { get: () => file });
    });

    const assignLayout = createNodeMiddleware(({ file, scope }) => {
        Object.defineProperty(file, 'layouts', { get: () => getLayouts(file) });
        function getLayouts(file) {
            const { parent } = file;
            const layout = parent && parent.layout;
            const isReset = layout && layout.isReset;
            const layouts = (parent && !isReset && getLayouts(parent)) || [];
            if (layout) layouts.push(layout);
            return layouts
        }
    });


    const createFlatList = treePayload => {
        createNodeMiddleware(payload => {
            if (payload.file.isPage || payload.file.isFallback)
            payload.state.treePayload.routes.push(payload.file);
        }).sync(treePayload);
        treePayload.routes.sort((c, p) => (c.ranking >= p.ranking ? -1 : 1));
    };

    const setPrototype = createNodeMiddleware(({ file }) => {
        const Prototype = file.root
            ? Root
            : file.children
                ? file.isFile ? PageDir : Dir
                : file.isReset
                    ? Reset
                    : file.isLayout
                        ? Layout
                        : file.isFallback
                            ? Fallback
                            : Page;
        Object.setPrototypeOf(file, Prototype.prototype);

        function Layout() { }
        function Dir() { }
        function Fallback() { }
        function Page() { }
        function PageDir() { }
        function Reset() { }
        function Root() { }
    });

    var miscPlugins = /*#__PURE__*/Object.freeze({
        __proto__: null,
        setRegex: setRegex,
        setParamKeys: setParamKeys,
        setShortPath: setShortPath,
        setRank: setRank,
        addMetaChildren: addMetaChildren,
        setIsIndexable: setIsIndexable,
        assignRelations: assignRelations,
        assignIndex: assignIndex,
        assignLayout: assignLayout,
        createFlatList: createFlatList,
        setPrototype: setPrototype
    });

    const assignAPI = createNodeMiddleware(({ file }) => {
        file.api = new ClientApi(file);
    });

    class ClientApi {
        constructor(file) {
            this.__file = file;
            Object.defineProperty(this, '__file', { enumerable: false });
            this.isMeta = !!file.isMeta;
            this.path = file.path;
            this.title = _prettyName(file);
            this.meta = file.meta;
        }

        get parent() { return !this.__file.root && this.__file.parent.api }
        get children() {
            return (this.__file.children || this.__file.isLayout && this.__file.parent.children || [])
                .filter(c => !c.isNonIndexable)
                .sort((a, b) => {
                    if(a.isMeta && b.isMeta) return 0
                    a = (a.meta.index || a.meta.title || a.path).toString();
                    b = (b.meta.index || b.meta.title || b.path).toString();
                    return a.localeCompare((b), undefined, { numeric: true, sensitivity: 'base' })
                })
                .map(({ api }) => api)
        }
        get next() { return _navigate(this, +1) }
        get prev() { return _navigate(this, -1) }
        preload() {
            this.__file.layouts.forEach(file => file.component());
            this.__file.component();
        }
    }

    function _navigate(node, direction) {
        if (!node.__file.root) {
            const siblings = node.parent.children;
            const index = siblings.indexOf(node);
            return node.parent.children[index + direction]
        }
    }


    function _prettyName(file) {
        if (typeof file.meta.title !== 'undefined') return file.meta.title
        else return (file.shortPath || file.path)
            .split('/')
            .pop()
            .replace(/-/g, ' ')
    }

    const plugins = {...miscPlugins, assignAPI};

    function buildClientTree(tree) {
      const order = [
        // pages
        "setParamKeys", //pages only
        "setRegex", //pages only
        "setShortPath", //pages only
        "setRank", //pages only
        "assignLayout", //pages only,
        // all
        "setPrototype",
        "addMetaChildren",
        "assignRelations", //all (except meta components?)
        "setIsIndexable", //all
        "assignIndex", //all
        "assignAPI", //all
        // routes
        "createFlatList"
      ];

      const payload = { tree, routes: [] };
      for (let name of order) {
        const syncFn = plugins[name].sync || plugins[name];
        syncFn(payload);
      }
      return payload
    }

    //tree
    const _tree = {
      "name": "root",
      "filepath": "/",
      "root": true,
      "ownMeta": {},
      "absolutePath": "src/pages",
      "children": [
        {
          "isFile": true,
          "isDir": false,
          "ext": "svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": true,
          "isPage": false,
          "ownMeta": {},
          "meta": {
            "preload": false,
            "prerender": true,
            "precache-order": false,
            "precache-proximity": true,
            "recursive": true
          },
          "path": "/_fallback",
          "id": "__fallback",
          "component": () => Promise.resolve().then(function () { return _fallback; }).then(m => m.default)
        },
        {
          "isFile": true,
          "isDir": false,
          "ext": "svelte",
          "isLayout": true,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": false,
          "ownMeta": {},
          "meta": {
            "preload": false,
            "prerender": true,
            "precache-order": false,
            "precache-proximity": true,
            "recursive": true
          },
          "path": "/",
          "id": "__layout",
          "component": () => Promise.resolve().then(function () { return _layout$5; }).then(m => m.default)
        },
        {
          "isFile": false,
          "isDir": true,
          "ext": "",
          "children": [
            {
              "isFile": true,
              "isDir": false,
              "ext": "svelte",
              "isLayout": true,
              "isReset": false,
              "isIndex": false,
              "isFallback": false,
              "isPage": false,
              "ownMeta": {},
              "meta": {
                "preload": false,
                "prerender": true,
                "precache-order": false,
                "precache-proximity": true,
                "recursive": true
              },
              "path": "/Constants",
              "id": "_Constants__layout",
              "component": () => Promise.resolve().then(function () { return _layout$4; }).then(m => m.default)
            },
            {
              "isFile": true,
              "isDir": false,
              "ext": "svelte",
              "isLayout": false,
              "isReset": false,
              "isIndex": false,
              "isFallback": false,
              "isPage": true,
              "ownMeta": {},
              "meta": {
                "preload": false,
                "prerender": true,
                "precache-order": false,
                "precache-proximity": true,
                "recursive": true
              },
              "path": "/Constants/Details",
              "id": "_Constants_Details",
              "component": () => Promise.resolve().then(function () { return Details$1; }).then(m => m.default)
            },
            {
              "isFile": true,
              "isDir": false,
              "ext": "svelte",
              "isLayout": false,
              "isReset": false,
              "isIndex": true,
              "isFallback": false,
              "isPage": true,
              "ownMeta": {},
              "meta": {
                "preload": false,
                "prerender": true,
                "precache-order": false,
                "precache-proximity": true,
                "recursive": true
              },
              "path": "/Constants/index",
              "id": "_Constants_index",
              "component": () => Promise.resolve().then(function () { return index$4; }).then(m => m.default)
            },
            {
              "isFile": true,
              "isDir": false,
              "ext": "svelte",
              "isLayout": false,
              "isReset": false,
              "isIndex": false,
              "isFallback": false,
              "isPage": true,
              "ownMeta": {},
              "meta": {
                "preload": false,
                "prerender": true,
                "precache-order": false,
                "precache-proximity": true,
                "recursive": true
              },
              "path": "/Constants/Item",
              "id": "_Constants_Item",
              "component": () => Promise.resolve().then(function () { return Item$3; }).then(m => m.default)
            },
            {
              "isFile": true,
              "isDir": false,
              "ext": "svelte",
              "isLayout": false,
              "isReset": false,
              "isIndex": false,
              "isFallback": false,
              "isPage": true,
              "ownMeta": {},
              "meta": {
                "preload": false,
                "prerender": true,
                "precache-order": false,
                "precache-proximity": true,
                "recursive": true
              },
              "path": "/Constants/NewItem",
              "id": "_Constants_NewItem",
              "component": () => Promise.resolve().then(function () { return NewItem$1; }).then(m => m.default)
            }
          ],
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": false,
          "ownMeta": {},
          "meta": {
            "preload": false,
            "prerender": true,
            "precache-order": false,
            "precache-proximity": true,
            "recursive": true
          },
          "path": "/Constants"
        },
        {
          "isFile": true,
          "isDir": false,
          "ext": "svelte",
          "isLayout": false,
          "isReset": false,
          "isIndex": true,
          "isFallback": false,
          "isPage": true,
          "ownMeta": {},
          "meta": {
            "preload": false,
            "prerender": true,
            "precache-order": false,
            "precache-proximity": true,
            "recursive": true
          },
          "path": "/index",
          "id": "_index",
          "component": () => Promise.resolve().then(function () { return index$3; }).then(m => m.default)
        },
        {
          "isFile": false,
          "isDir": true,
          "ext": "",
          "children": [
            {
              "isFile": true,
              "isDir": false,
              "ext": "svelte",
              "isLayout": true,
              "isReset": false,
              "isIndex": false,
              "isFallback": false,
              "isPage": false,
              "ownMeta": {},
              "meta": {
                "preload": false,
                "prerender": true,
                "precache-order": false,
                "precache-proximity": true,
                "recursive": true
              },
              "path": "/Logs",
              "id": "_Logs__layout",
              "component": () => Promise.resolve().then(function () { return _layout$3; }).then(m => m.default)
            },
            {
              "isFile": true,
              "isDir": false,
              "ext": "svelte",
              "isLayout": false,
              "isReset": false,
              "isIndex": true,
              "isFallback": false,
              "isPage": true,
              "ownMeta": {},
              "meta": {
                "preload": false,
                "prerender": true,
                "precache-order": false,
                "precache-proximity": true,
                "recursive": true
              },
              "path": "/Logs/index",
              "id": "_Logs_index",
              "component": () => Promise.resolve().then(function () { return index$2; }).then(m => m.default)
            },
            {
              "isFile": true,
              "isDir": false,
              "ext": "svelte",
              "isLayout": false,
              "isReset": false,
              "isIndex": false,
              "isFallback": false,
              "isPage": true,
              "ownMeta": {},
              "meta": {
                "preload": false,
                "prerender": true,
                "precache-order": false,
                "precache-proximity": true,
                "recursive": true
              },
              "path": "/Logs/Item",
              "id": "_Logs_Item",
              "component": () => Promise.resolve().then(function () { return Item$1; }).then(m => m.default)
            },
            {
              "isFile": true,
              "isDir": false,
              "ext": "svelte",
              "isLayout": false,
              "isReset": false,
              "isIndex": false,
              "isFallback": false,
              "isPage": true,
              "ownMeta": {},
              "meta": {
                "preload": false,
                "prerender": true,
                "precache-order": false,
                "precache-proximity": true,
                "recursive": true
              },
              "path": "/Logs/Modal",
              "id": "_Logs_Modal",
              "component": () => Promise.resolve().then(function () { return Modal$1; }).then(m => m.default)
            }
          ],
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": false,
          "ownMeta": {},
          "meta": {
            "preload": false,
            "prerender": true,
            "precache-order": false,
            "precache-proximity": true,
            "recursive": true
          },
          "path": "/Logs"
        },
        {
          "isFile": false,
          "isDir": true,
          "ext": "",
          "children": [
            {
              "isFile": true,
              "isDir": false,
              "ext": "svelte",
              "isLayout": true,
              "isReset": false,
              "isIndex": false,
              "isFallback": false,
              "isPage": false,
              "ownMeta": {},
              "meta": {
                "preload": false,
                "prerender": true,
                "precache-order": false,
                "precache-proximity": true,
                "recursive": true
              },
              "path": "/Models",
              "id": "_Models__layout",
              "component": () => Promise.resolve().then(function () { return _layout$2; }).then(m => m.default)
            },
            {
              "isFile": true,
              "isDir": false,
              "ext": "svelte",
              "isLayout": false,
              "isReset": false,
              "isIndex": true,
              "isFallback": false,
              "isPage": true,
              "ownMeta": {},
              "meta": {
                "preload": false,
                "prerender": true,
                "precache-order": false,
                "precache-proximity": true,
                "recursive": true
              },
              "path": "/Models/index",
              "id": "_Models_index",
              "component": () => Promise.resolve().then(function () { return index$1; }).then(m => m.default)
            },
            {
              "isFile": false,
              "isDir": true,
              "ext": "",
              "children": [
                {
                  "isFile": true,
                  "isDir": false,
                  "ext": "svelte",
                  "isLayout": false,
                  "isReset": false,
                  "isIndex": false,
                  "isFallback": false,
                  "isPage": true,
                  "ownMeta": {},
                  "meta": {
                    "preload": false,
                    "prerender": true,
                    "precache-order": false,
                    "precache-proximity": true,
                    "recursive": true
                  },
                  "path": "/Models/Manage/:id",
                  "id": "_Models_Manage__id",
                  "component": () => Promise.resolve().then(function () { return _id_; }).then(m => m.default)
                }
              ],
              "isLayout": false,
              "isReset": false,
              "isIndex": false,
              "isFallback": false,
              "isPage": false,
              "ownMeta": {},
              "meta": {
                "preload": false,
                "prerender": true,
                "precache-order": false,
                "precache-proximity": true,
                "recursive": true
              },
              "path": "/Models/Manage"
            }
          ],
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": false,
          "ownMeta": {},
          "meta": {
            "preload": false,
            "prerender": true,
            "precache-order": false,
            "precache-proximity": true,
            "recursive": true
          },
          "path": "/Models"
        },
        {
          "isFile": false,
          "isDir": true,
          "ext": "",
          "children": [
            {
              "isFile": true,
              "isDir": false,
              "ext": "svelte",
              "isLayout": true,
              "isReset": false,
              "isIndex": false,
              "isFallback": false,
              "isPage": false,
              "ownMeta": {},
              "meta": {
                "preload": false,
                "prerender": true,
                "precache-order": false,
                "precache-proximity": true,
                "recursive": true
              },
              "path": "/Users",
              "id": "_Users__layout",
              "component": () => Promise.resolve().then(function () { return _layout$1; }).then(m => m.default)
            },
            {
              "isFile": true,
              "isDir": false,
              "ext": "svelte",
              "isLayout": false,
              "isReset": false,
              "isIndex": true,
              "isFallback": false,
              "isPage": true,
              "ownMeta": {},
              "meta": {
                "preload": false,
                "prerender": true,
                "precache-order": false,
                "precache-proximity": true,
                "recursive": true
              },
              "path": "/Users/index",
              "id": "_Users_index",
              "component": () => Promise.resolve().then(function () { return index; }).then(m => m.default)
            },
            {
              "isFile": false,
              "isDir": true,
              "ext": "",
              "children": [
                {
                  "isFile": true,
                  "isDir": false,
                  "ext": "svelte",
                  "isLayout": true,
                  "isReset": false,
                  "isIndex": false,
                  "isFallback": false,
                  "isPage": false,
                  "ownMeta": {},
                  "meta": {
                    "preload": false,
                    "prerender": true,
                    "precache-order": false,
                    "precache-proximity": true,
                    "recursive": true
                  },
                  "path": "/Users/Manage",
                  "id": "_Users_Manage__layout",
                  "component": () => Promise.resolve().then(function () { return _layout; }).then(m => m.default)
                }
              ],
              "isLayout": false,
              "isReset": false,
              "isIndex": false,
              "isFallback": false,
              "isPage": false,
              "ownMeta": {},
              "meta": {
                "preload": false,
                "prerender": true,
                "precache-order": false,
                "precache-proximity": true,
                "recursive": true
              },
              "path": "/Users/Manage"
            }
          ],
          "isLayout": false,
          "isReset": false,
          "isIndex": false,
          "isFallback": false,
          "isPage": false,
          "ownMeta": {},
          "meta": {
            "preload": false,
            "prerender": true,
            "precache-order": false,
            "precache-proximity": true,
            "recursive": true
          },
          "path": "/Users"
        }
      ],
      "isLayout": false,
      "isReset": false,
      "isIndex": false,
      "isFallback": false,
      "meta": {
        "preload": false,
        "prerender": true,
        "precache-order": false,
        "precache-proximity": true,
        "recursive": true
      },
      "path": "/"
    };


    const {tree, routes} = buildClientTree(_tree);

    /* src\App.svelte generated by Svelte v3.24.1 */

    function create_fragment$q(ctx) {
    	let div;
    	let router;
    	let current;
    	router = new Router({ props: { routes } });

    	return {
    		c() {
    			div = element("div");
    			create_component(router.$$.fragment);
    			this.h();
    		},
    		l(nodes) {
    			div = claim_element(nodes, "DIV", { class: true });
    			var div_nodes = children(div);
    			claim_component(router.$$.fragment, div_nodes);
    			div_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(div, "class", "container text-gray-700");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			mount_component(router, div, null);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			destroy_component(router);
    		}
    	};
    }

    class App extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$1(this, options, null, create_fragment$q, safe_not_equal, {});
    	}
    }

    const app = HMR(App, { target: document.body }, "routify-app");

    /* src\pages\_fallback.svelte generated by Svelte v3.24.1 */

    function add_css$2() {
    	var style = element("style");
    	style.id = "svelte-viq1pm-style";
    	style.textContent = ".huge.svelte-viq1pm{font-size:12rem}.e404.svelte-viq1pm{position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);text-align:center}";
    	append(document.head, style);
    }

    function create_fragment$p(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let a;
    	let t3;
    	let a_href_value;

    	return {
    		c() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text("404");
    			t1 = space();
    			div1 = element("div");
    			t2 = text("Page not found.\r\n  ");
    			a = element("a");
    			t3 = text("Go back");
    			this.h();
    		},
    		l(nodes) {
    			div2 = claim_element(nodes, "DIV", { class: true });
    			var div2_nodes = children(div2);
    			div0 = claim_element(div2_nodes, "DIV", { class: true });
    			var div0_nodes = children(div0);
    			t0 = claim_text(div0_nodes, "404");
    			div0_nodes.forEach(detach);
    			t1 = claim_space(div2_nodes);
    			div1 = claim_element(div2_nodes, "DIV", { class: true });
    			var div1_nodes = children(div1);
    			t2 = claim_text(div1_nodes, "Page not found.\r\n  ");
    			a = claim_element(div1_nodes, "A", { href: true });
    			var a_nodes = children(a);
    			t3 = claim_text(a_nodes, "Go back");
    			a_nodes.forEach(detach);
    			div1_nodes.forEach(detach);
    			div2_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(div0, "class", "huge svelte-viq1pm");
    			attr(a, "href", a_href_value = /*$url*/ ctx[0]("../"));
    			attr(div1, "class", "big");
    			attr(div2, "class", "e404 svelte-viq1pm");
    		},
    		m(target, anchor) {
    			insert(target, div2, anchor);
    			append(div2, div0);
    			append(div0, t0);
    			append(div2, t1);
    			append(div2, div1);
    			append(div1, t2);
    			append(div1, a);
    			append(a, t3);
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*$url*/ 1 && a_href_value !== (a_href_value = /*$url*/ ctx[0]("../"))) {
    				attr(a, "href", a_href_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div2);
    		}
    	};
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let $url;
    	component_subscribe($$self, url, $$value => $$invalidate(0, $url = $$value));
    	return [$url];
    }

    class Fallback extends SvelteComponent {
    	constructor(options) {
    		super();
    		if (!document.getElementById("svelte-viq1pm-style")) add_css$2();
    		init$1(this, options, instance$n, create_fragment$p, safe_not_equal, {});
    	}
    }

    var _fallback = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Fallback
    });

    /* src\_components\Header.svelte generated by Svelte v3.24.1 */

    function create_fragment$o(ctx) {
    	let header;
    	let div;
    	let a;
    	let span;
    	let img;
    	let img_src_value;

    	return {
    		c() {
    			header = element("header");
    			div = element("div");
    			a = element("a");
    			span = element("span");
    			img = element("img");
    			this.h();
    		},
    		l(nodes) {
    			header = claim_element(nodes, "HEADER", { class: true });
    			var header_nodes = children(header);
    			div = claim_element(header_nodes, "DIV", { class: true });
    			var div_nodes = children(div);
    			a = claim_element(div_nodes, "A", { href: true, class: true });
    			var a_nodes = children(a);
    			span = claim_element(a_nodes, "SPAN", { class: true });
    			var span_nodes = children(span);
    			img = claim_element(span_nodes, "IMG", { src: true, alt: true, class: true });
    			span_nodes.forEach(detach);
    			a_nodes.forEach(detach);
    			div_nodes.forEach(detach);
    			header_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			if (img.src !== (img_src_value = "./logo.svg")) attr(img, "src", img_src_value);
    			attr(img, "alt", "");
    			attr(img, "class", "w-64 h-10");
    			attr(span, "class", "text-xl font-light text-blue-700 underline hover:no-underline");
    			attr(a, "href", "/");
    			attr(a, "class", "flex items-center mb-4 font-medium text-gray-900 title-font md:mb-0");
    			attr(div, "class", "container flex flex-col flex-wrap items-center py-5 mx-auto md:flex-row");
    			attr(header, "class", "text-gray-700");
    		},
    		m(target, anchor) {
    			insert(target, header, anchor);
    			append(header, div);
    			append(div, a);
    			append(a, span);
    			append(span, img);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(header);
    		}
    	};
    }

    class Header extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$1(this, options, null, create_fragment$o, safe_not_equal, {});
    	}
    }

    /* src\_components\Footer.svelte generated by Svelte v3.24.1 */

    function create_fragment$n(ctx) {
    	let footer;
    	let div;
    	let ul;
    	let li0;
    	let a0;
    	let t0;
    	let t1;
    	let li1;
    	let a1;
    	let t2;
    	let t3;
    	let li2;
    	let a2;
    	let t4;
    	let t5;
    	let li3;
    	let a3;
    	let t6;

    	return {
    		c() {
    			footer = element("footer");
    			div = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			t0 = text("GraphQL Editor");
    			t1 = space();
    			li1 = element("li");
    			a1 = element("a");
    			t2 = text("Liquid Evaluator");
    			t3 = space();
    			li2 = element("li");
    			a2 = element("a");
    			t4 = text("Documentation");
    			t5 = space();
    			li3 = element("li");
    			a3 = element("a");
    			t6 = text("Partner Portal");
    			this.h();
    		},
    		l(nodes) {
    			footer = claim_element(nodes, "FOOTER", { class: true });
    			var footer_nodes = children(footer);
    			div = claim_element(footer_nodes, "DIV", { class: true });
    			var div_nodes = children(div);
    			ul = claim_element(div_nodes, "UL", { class: true });
    			var ul_nodes = children(ul);
    			li0 = claim_element(ul_nodes, "LI", {});
    			var li0_nodes = children(li0);
    			a0 = claim_element(li0_nodes, "A", { class: true, href: true });
    			var a0_nodes = children(a0);
    			t0 = claim_text(a0_nodes, "GraphQL Editor");
    			a0_nodes.forEach(detach);
    			li0_nodes.forEach(detach);
    			t1 = claim_space(ul_nodes);
    			li1 = claim_element(ul_nodes, "LI", {});
    			var li1_nodes = children(li1);
    			a1 = claim_element(li1_nodes, "A", { class: true, href: true });
    			var a1_nodes = children(a1);
    			t2 = claim_text(a1_nodes, "Liquid Evaluator");
    			a1_nodes.forEach(detach);
    			li1_nodes.forEach(detach);
    			t3 = claim_space(ul_nodes);
    			li2 = claim_element(ul_nodes, "LI", {});
    			var li2_nodes = children(li2);
    			a2 = claim_element(li2_nodes, "A", { class: true, href: true });
    			var a2_nodes = children(a2);
    			t4 = claim_text(a2_nodes, "Documentation");
    			a2_nodes.forEach(detach);
    			li2_nodes.forEach(detach);
    			t5 = claim_space(ul_nodes);
    			li3 = claim_element(ul_nodes, "LI", {});
    			var li3_nodes = children(li3);
    			a3 = claim_element(li3_nodes, "A", { class: true, href: true });
    			var a3_nodes = children(a3);
    			t6 = claim_text(a3_nodes, "Partner Portal");
    			a3_nodes.forEach(detach);
    			li3_nodes.forEach(detach);
    			ul_nodes.forEach(detach);
    			div_nodes.forEach(detach);
    			footer_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(a0, "class", "underline hover:no-underline hover:text-gray-800");
    			attr(a0, "href", "http://localhost:3333/gui/graphql");
    			attr(a1, "class", "underline hover:no-underline hover:text-gray-800");
    			attr(a1, "href", "http://localhost:3333/gui/liquid");
    			attr(a2, "class", "underline hover:no-underline hover:text-gray-800");
    			attr(a2, "href", "https://documentation.platformos.com");
    			attr(a3, "class", "underline hover:no-underline hover:text-gray-800");
    			attr(a3, "href", "https://partners.platformos.com");
    			attr(ul, "class", "grid grid-cols-4 gap-5 text-sm text-center");
    			attr(div, "class", "container");
    			attr(footer, "class", "py-3 mt-8 text-gray-600 border-t border-gray-400");
    		},
    		m(target, anchor) {
    			insert(target, footer, anchor);
    			append(footer, div);
    			append(div, ul);
    			append(ul, li0);
    			append(li0, a0);
    			append(a0, t0);
    			append(ul, t1);
    			append(ul, li1);
    			append(li1, a1);
    			append(a1, t2);
    			append(ul, t3);
    			append(ul, li2);
    			append(li2, a2);
    			append(a2, t4);
    			append(ul, t5);
    			append(ul, li3);
    			append(li3, a3);
    			append(a3, t6);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(footer);
    		}
    	};
    }

    class Footer extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$1(this, options, null, create_fragment$n, safe_not_equal, {});
    	}
    }

    const notification = writable();

    /* node_modules\@beyonk\svelte-notifications\src\Notifications.svelte generated by Svelte v3.24.1 */

    const { document: document_1$1 } = globals;

    function add_css$1() {
    	var style = element("style");
    	style.id = "svelte-riwzrl-style";
    	style.textContent = ".toasts{list-style:none;position:fixed;top:0;right:0;padding:0;margin:0;z-index:9999}.svelte-riwzrl.svelte-riwzrl.toasts>.toast.svelte-riwzrl.svelte-riwzrl{position:relative;margin:1vh 1vw;min-width:40vw;position:relative;animation:svelte-riwzrl-animate-in 600ms forwards;color:#fff}.svelte-riwzrl.toasts>.toast.svelte-riwzrl>.content.svelte-riwzrl{padding:1vw;display:block;font-weight:500}.svelte-riwzrl.toasts>.toast.svelte-riwzrl>.progress.svelte-riwzrl{position:absolute;bottom:0;background-color:rgb(0, 0, 0, 0.3);height:6px;width:100%;animation-name:svelte-riwzrl-shrink;animation-timing-function:linear;animation-fill-mode:forwards}.svelte-riwzrl.svelte-riwzrl.toasts>.toast.svelte-riwzrl.svelte-riwzrl:before,.svelte-riwzrl.svelte-riwzrl.toasts>.toast.svelte-riwzrl.svelte-riwzrl:after{content:\"\";position:absolute;z-index:-1;top:50%;bottom:0;left:1vw;right:1vw;border-radius:100px / 10px}.svelte-riwzrl.svelte-riwzrl.toasts>.toast.svelte-riwzrl.svelte-riwzrl:after{right:1vw;left:auto;transform:skew(8deg) rotate(3deg)}@keyframes svelte-riwzrl-animate-in{0%,60%,75%,90%,to{-webkit-animation-timing-function:cubic-bezier(.215, .61, .355, 1);animation-timing-function:cubic-bezier(.215, .61, .355, 1)}0%{opacity:0;transform:translate3d(3000px, 0, 0)}60%{opacity:1;transform:translate3d(-25px, 0, 0)}75%{transform:translate3d(10px, 0, 0)}90%{transform:translate3d(-5px, 0, 0)}to{transform:none}}@keyframes svelte-riwzrl-shrink{0%{width:98vw}100%{width:0}}@media(min-width: 480px){@keyframes svelte-riwzrl-animate-in{0%,60%,75%,90%,to{-webkit-animation-timing-function:cubic-bezier(.215, .61, .355, 1);animation-timing-function:cubic-bezier(.215, .61, .355, 1)}0%{opacity:0;transform:translate3d(3000px, 0, 0)}60%{opacity:1;transform:translate3d(-25px, 0, 0)}75%{transform:translate3d(10px, 0, 0)}90%{transform:translate3d(-5px, 0, 0)}to{transform:none}}@keyframes svelte-riwzrl-shrink{0%{width:40vw}100%{width:0}}}";
    	append(document_1$1.head, style);
    }

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (2:1) {#each toasts as toast (toast.id)}
    function create_each_block$7(key_1, ctx) {
    	let li;
    	let div0;
    	let t0_value = /*toast*/ ctx[8].msg + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let li_outro;
    	let current;
    	let mounted;
    	let dispose;

    	function animationend_handler(...args) {
    		return /*animationend_handler*/ ctx[4](/*toast*/ ctx[8], ...args);
    	}

    	return {
    		key: key_1,
    		first: null,
    		c() {
    			li = element("li");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			this.h();
    		},
    		l(nodes) {
    			li = claim_element(nodes, "LI", { class: true, style: true });
    			var li_nodes = children(li);
    			div0 = claim_element(li_nodes, "DIV", { class: true });
    			var div0_nodes = children(div0);
    			t0 = claim_text(div0_nodes, t0_value);
    			div0_nodes.forEach(detach);
    			t1 = claim_space(li_nodes);
    			div1 = claim_element(li_nodes, "DIV", { class: true, style: true });
    			var div1_nodes = children(div1);
    			div1_nodes.forEach(detach);
    			t2 = claim_space(li_nodes);
    			li_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(div0, "class", "content svelte-riwzrl");
    			attr(div1, "class", "progress svelte-riwzrl");
    			set_style(div1, "animation-duration", /*toast*/ ctx[8].timeout + "ms");
    			attr(li, "class", "toast svelte-riwzrl");
    			set_style(li, "background", /*toast*/ ctx[8].background);
    			this.first = li;
    		},
    		m(target, anchor) {
    			insert(target, li, anchor);
    			append(li, div0);
    			append(div0, t0);
    			append(li, t1);
    			append(li, div1);
    			append(li, t2);
    			current = true;

    			if (!mounted) {
    				dispose = listen(div1, "animationend", animationend_handler);
    				mounted = true;
    			}
    		},
    		p(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*toasts*/ 1) && t0_value !== (t0_value = /*toast*/ ctx[8].msg + "")) set_data(t0, t0_value);

    			if (!current || dirty & /*toasts*/ 1) {
    				set_style(div1, "animation-duration", /*toast*/ ctx[8].timeout + "ms");
    			}

    			if (!current || dirty & /*toasts*/ 1) {
    				set_style(li, "background", /*toast*/ ctx[8].background);
    			}
    		},
    		i(local) {
    			if (current) return;
    			if (li_outro) li_outro.end(1);
    			current = true;
    		},
    		o(local) {
    			li_outro = create_out_transition(li, animateOut, {});
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(li);
    			if (detaching && li_outro) li_outro.end();
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function create_fragment$m(ctx) {
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*toasts*/ ctx[0];
    	const get_key = ctx => /*toast*/ ctx[8].id;

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$7(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$7(key, child_ctx));
    	}

    	return {
    		c() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			this.h();
    		},
    		l(nodes) {
    			ul = claim_element(nodes, "UL", { class: true });
    			var ul_nodes = children(ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(ul_nodes);
    			}

    			ul_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(ul, "class", "toasts svelte-riwzrl");
    		},
    		m(target, anchor) {
    			insert(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*toasts, removeToast*/ 3) {
    				const each_value = /*toasts*/ ctx[0];
    				group_outros();
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, outro_and_destroy_block, create_each_block$7, null, get_each_context$7);
    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};
    }

    function animateOut(node, { delay = 0, duration = 1000 }) {

    	return {
    		delay,
    		duration,
    		css: t => `opacity: ${(t - 0.7) * 1}; transform-origin: top right;`
    	};
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { themes = {
    		danger: "#bb2124",
    		success: "#22bb33",
    		warning: "#f0ad4e",
    		info: "#5bc0de",
    		default: "#aaaaaa"
    	} } = $$props;

    	let { timeout = 3000 } = $$props;
    	let count = 0;
    	let toasts = [];
    	let unsubscribe;

    	function createToast(msg, theme, to) {
    		const background = themes[theme] || themes["default"];

    		$$invalidate(0, toasts = [
    			{
    				id: count,
    				msg,
    				background,
    				timeout: to || timeout,
    				width: "100%"
    			},
    			...toasts
    		]);

    		count = count + 1;
    	}

    	unsubscribe = notification.subscribe(value => {
    		if (!value) {
    			return;
    		}

    		createToast(value.message, value.type, value.timeout);
    		notification.set();
    	});

    	onDestroy(unsubscribe);

    	function removeToast(id) {
    		$$invalidate(0, toasts = toasts.filter(t => t.id != id));
    	}

    	const animationend_handler = toast => removeToast(toast.id);

    	$$self.$$set = $$props => {
    		if ("themes" in $$props) $$invalidate(2, themes = $$props.themes);
    		if ("timeout" in $$props) $$invalidate(3, timeout = $$props.timeout);
    	};

    	return [toasts, removeToast, themes, timeout, animationend_handler];
    }

    class Notifications extends SvelteComponent {
    	constructor(options) {
    		super();
    		if (!document_1$1.getElementById("svelte-riwzrl-style")) add_css$1();
    		init$1(this, options, instance$m, create_fragment$m, safe_not_equal, { themes: 2, timeout: 3 });
    	}
    }

    function send (message, type = 'default', timeout) {
      notification.set({ type, message, timeout });
    }

    function danger (msg, timeout) {
      send(msg, 'danger', timeout);
    }

    function success (msg, timeout) {
      send(msg, 'success', timeout);
    }

    /* src\pages\_layout.svelte generated by Svelte v3.24.1 */

    function create_fragment$l(ctx) {
    	let header;
    	let t0;
    	let notificationdisplay;
    	let t1;
    	let t2;
    	let footer;
    	let current;
    	header = new Header({});
    	notificationdisplay = new Notifications({});
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);
    	footer = new Footer({});

    	return {
    		c() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			create_component(notificationdisplay.$$.fragment);
    			t1 = space();
    			if (default_slot) default_slot.c();
    			t2 = space();
    			create_component(footer.$$.fragment);
    		},
    		l(nodes) {
    			claim_component(header.$$.fragment, nodes);
    			t0 = claim_space(nodes);
    			claim_component(notificationdisplay.$$.fragment, nodes);
    			t1 = claim_space(nodes);
    			if (default_slot) default_slot.l(nodes);
    			t2 = claim_space(nodes);
    			claim_component(footer.$$.fragment, nodes);
    		},
    		m(target, anchor) {
    			mount_component(header, target, anchor);
    			insert(target, t0, anchor);
    			mount_component(notificationdisplay, target, anchor);
    			insert(target, t1, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert(target, t2, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(notificationdisplay.$$.fragment, local);
    			transition_in(default_slot, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(notificationdisplay.$$.fragment, local);
    			transition_out(default_slot, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach(t0);
    			destroy_component(notificationdisplay, detaching);
    			if (detaching) detach(t1);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach(t2);
    			destroy_component(footer, detaching);
    		}
    	};
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, $$slots];
    }

    class Layout$5 extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$1(this, options, instance$l, create_fragment$l, safe_not_equal, {});
    	}
    }

    var _layout$5 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Layout$5
    });

    /* src\pages\Constants\_layout.svelte generated by Svelte v3.24.1 */

    function create_fragment$k(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	return {
    		c() {
    			if (default_slot) default_slot.c();
    		},
    		l(nodes) {
    			if (default_slot) default_slot.l(nodes);
    		},
    		m(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, $$slots];
    }

    class Layout$4 extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$1(this, options, instance$k, create_fragment$k, safe_not_equal, {});
    	}
    }

    var _layout$4 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Layout$4
    });

    const constants = writable([]);

    /* src\pages\Constants\Details.svelte generated by Svelte v3.24.1 */

    function create_fragment$j(ctx) {
    	let details;
    	let summary;
    	let t0;
    	let t1;
    	let pre;
    	let t2_value = JSON.stringify(/*$constants*/ ctx[0], null, 4) + "";
    	let t2;

    	return {
    		c() {
    			details = element("details");
    			summary = element("summary");
    			t0 = text("Raw data");
    			t1 = space();
    			pre = element("pre");
    			t2 = text(t2_value);
    			this.h();
    		},
    		l(nodes) {
    			details = claim_element(nodes, "DETAILS", { class: true });
    			var details_nodes = children(details);
    			summary = claim_element(details_nodes, "SUMMARY", { class: true });
    			var summary_nodes = children(summary);
    			t0 = claim_text(summary_nodes, "Raw data");
    			summary_nodes.forEach(detach);
    			t1 = claim_space(details_nodes);
    			pre = claim_element(details_nodes, "PRE", { class: true });
    			var pre_nodes = children(pre);
    			t2 = claim_text(pre_nodes, t2_value);
    			pre_nodes.forEach(detach);
    			details_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(summary, "class", "text-gray-600");
    			attr(pre, "class", "text-sm bg-gray-200 break-all overflow-x-auto");
    			attr(details, "class", "mt-4");
    		},
    		m(target, anchor) {
    			insert(target, details, anchor);
    			append(details, summary);
    			append(summary, t0);
    			append(details, t1);
    			append(details, pre);
    			append(pre, t2);
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*$constants*/ 1 && t2_value !== (t2_value = JSON.stringify(/*$constants*/ ctx[0], null, 4) + "")) set_data(t2, t2_value);
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(details);
    		}
    	};
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let $constants;
    	component_subscribe($$self, constants, $$value => $$invalidate(0, $constants = $$value));
    	return [$constants];
    }

    class Details extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$1(this, options, instance$j, create_fragment$j, safe_not_equal, {});
    	}
    }

    var Details$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Details
    });

    const createStore$2 = () => {
      const { subscribe, set, update } = writable({});
      return {
        subscribe,
        set,
        update,
        reset: () => {
          set({});
        }
      };
    };
    var filtersStore = createStore$2();

    var __defProp = Object.defineProperty;
    var __defProps = Object.defineProperties;
    var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
    var __getOwnPropSymbols = Object.getOwnPropertySymbols;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __propIsEnum = Object.prototype.propertyIsEnumerable;
    var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    var __spreadValues = (a, b) => {
      for (var prop in b || (b = {}))
        if (__hasOwnProp.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      if (__getOwnPropSymbols)
        for (var prop of __getOwnPropSymbols(b)) {
          if (__propIsEnum.call(b, prop))
            __defNormalProp(a, prop, b[prop]);
        }
      return a;
    };
    var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
    const createStore$1 = () => {
      const { subscribe, set, update } = writable({ page: 1 });
      return {
        subscribe,
        set,
        update,
        setPaginationData: ({ total_entries, total_pages }) => {
          update((s) => {
            return __spreadProps(__spreadValues({}, s), { total_entries, total_pages });
          });
        },
        setSchemaId: (id) => {
          update((s) => __spreadProps(__spreadValues({}, s), { schemaId: id }));
        },
        reset: () => update((s) => __spreadProps(__spreadValues({}, s), { page: 1 })),
        increment: () => {
          update((s) => {
            const page = s.page + 1;
            return __spreadProps(__spreadValues({}, s), { page });
          });
        },
        decrement: () => {
          update((s) => {
            const page = s.page - 1 || 1;
            return __spreadProps(__spreadValues({}, s), { page });
          });
        }
      };
    };
    var pageStore = createStore$1();

    var typeMap = {
      array: "value_array",
      boolean: "value_boolean",
      date: "value",
      datetime: "value",
      float: "value_float",
      integer: "value_int",
      string: "value",
      text: "value",
      upload: "value"
    };

    const getPropsString = (props) => {
      return Object.keys(props).map((prop) => {
        const { name, value, attribute_type } = props[prop];
        const updateType = typeMap[attribute_type];
        return `{ name: "${name}", ${updateType}: ${value}}`;
      }).join("\n");
    };
    const getPropertiesFilter = (f) => {
      const filterString = `
    properties: [{
      name: "${f.property}"
      ${f.operation}: ${f.value}
    }]
  `;
      return filterString;
    };
    const graph = (body, successMessage = "Success") => {
      return fetch(`http://localhost:${parseInt(window.location.port)-1}/api/graph`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(body)
      }).then((res) => res.json()).then((res) => {
        if (res.errors) {
          const err = res.errors[0].message;
          return danger(`Error: ${err}`, 5e3);
        } else {
          if (successMessage !== false) {
            success(successMessage);
          }
        }
        return res && res.data;
      });
    };
    var api = {
      getModelSchemas(id) {
        const filter = id ? `filter: { id: { value: ${id} } }` : "";
        const query = `query {
      admin_model_schemas(
          per_page: 100
          ${filter}
        ) {
        results {
          id
          name
          properties {
            name
            attribute_type
          }
        }
      }
    }`;
        return graph({ query }, false).then((data) => data.admin_model_schemas.results);
      },
      getModels({ schemaId, id, page = 1, deleted = false }) {
        const f = get_store_value(filtersStore);
        let propertyFilter = "";
        if (f.property && f.operation && f.type) {
          propertyFilter = getPropertiesFilter(f);
        }
        const deletedFilter = deleted ? `deleted_at: { exists: true }` : "";
        const idFilter = id ? `id: { value: ${id} }` : "";
        const schemaIdFilter = schemaId ? `model_schema_id: { value: ${schemaId} }` : "";
        const query = `query {
      models(
        page: ${page}
        per_page: 20,
        sort: { created_at: { order: DESC } },
        filter: {
          ${schemaIdFilter}
          ${idFilter}
          ${deletedFilter}
          ${propertyFilter}
        }
      ) {
        total_pages
        results {
          id
          created_at
          updated_at
          deleted_at
          properties
        }
      }
    }`;
        return graph({ query }, false).then((data) => {
          if (data && data.models) {
            pageStore.setPaginationData({ total_pages: data.models.total_pages });
          }
          return data.models.results;
        });
      },
      updateModel({ id, props }) {
        const properties = getPropsString(props);
        const query = `
      mutation {
        model_update(
          id: ${id},
          model: {
            properties: [${properties}]
          }
        ) {
          id
        }
      }`;
        return graph({ query });
      },
      deleteModel(id) {
        const query = `mutation {
      model_delete(id: ${id}) {
        id
      }
    }`;
        return graph({ query });
      },
      undeleteModel(id) {
        const query = `
      mutation {
        model_update(
          id: ${id},
          model: { deleted_at: null }
        ) {
          id
        }
      }`;
        return graph({ query });
      },
      createModel(schemaName, props) {
        const properties = getPropsString(props);
        const query = `mutation {
      model_create(model: {
        model_schema_name: "${schemaName}",
        properties: [${properties}]
      }) {
        id
      }
    }`;
        return graph({ query });
      },
      getUsers(email = "", fn = "", ln = "") {
        const query = `query getUsers {
      users(per_page: 20,
        page: 1,
        filter: {
          email: { contains: "${email}" },
          first_name: { contains: "${fn}" },
          last_name: { contains: "${ln}" }
        }
      ) {
        results {
          id
          email
          deleted_at
          created_at
          first_name
          last_name
          external_id
          jwt_token
          temporary_token
        }
      }
    }`;
        return graph({ query }, false);
      },
      getLogs() {
        return fetch(`http://localhost:${parseInt(window.location.port)-1}/api/logs`).then((res) => res.json());
      },
      getConstants() {
        const query = `query getConstants {
      constants(per_page: 99) {
        results { name, value, updated_at }
      }
    }`;
        return graph({ query }, false);
      },
      setConstant(name, value) {
        const query = `mutation {
      constant_set(name: "${name}", value: "${value}") {
        name, value
      }
    }`;
        return graph({ query }, "Constant updated");
      },
      unsetConstant(name) {
        const query = `mutation {
      constant_unset(name: "${name}") {
        name
      }
    }`;
        return graph({ query }, "Constant unset");
      }
    };

    function fetchConstants() {
      api.getConstants().then((json) => {
        constants.set(json.constants.results);
      });
    }

    /* src\pages\Constants\Item.svelte generated by Svelte v3.24.1 */

    function create_fragment$i(ctx) {
    	let li;
    	let form;
    	let label;
    	let t0_value = /*item*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let button0;
    	let t2;
    	let t3;
    	let input;
    	let input_value_value;
    	let t4;
    	let button1;
    	let t5;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			li = element("li");
    			form = element("form");
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = space();
    			button0 = element("button");
    			t2 = text("Delete");
    			t3 = space();
    			input = element("input");
    			t4 = space();
    			button1 = element("button");
    			t5 = text("Save");
    			this.h();
    		},
    		l(nodes) {
    			li = claim_element(nodes, "LI", { class: true });
    			var li_nodes = children(li);
    			form = claim_element(li_nodes, "FORM", { action: true, class: true });
    			var form_nodes = children(form);
    			label = claim_element(form_nodes, "LABEL", { for: true, class: true });
    			var label_nodes = children(label);
    			t0 = claim_text(label_nodes, t0_value);
    			label_nodes.forEach(detach);
    			t1 = claim_space(form_nodes);
    			button0 = claim_element(form_nodes, "BUTTON", { type: true, class: true });
    			var button0_nodes = children(button0);
    			t2 = claim_text(button0_nodes, "Delete");
    			button0_nodes.forEach(detach);
    			t3 = claim_space(form_nodes);

    			input = claim_element(form_nodes, "INPUT", {
    				class: true,
    				type: true,
    				id: true,
    				value: true,
    				required: true,
    				placeholder: true
    			});

    			t4 = claim_space(form_nodes);
    			button1 = claim_element(form_nodes, "BUTTON", { class: true });
    			var button1_nodes = children(button1);
    			t5 = claim_text(button1_nodes, "Save");
    			button1_nodes.forEach(detach);
    			form_nodes.forEach(detach);
    			li_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(label, "for", "val");
    			attr(label, "class", "font-semibold cursor-pointer");
    			attr(button0, "type", "button");
    			attr(button0, "class", "rounded px-2 py-1 text-sm border border-gray-300 mb-2");
    			attr(input, "class", "rounded w-full px-2 py-1 mb-2 bg-white text-gray-600");
    			attr(input, "type", "text");
    			attr(input, "id", "val");
    			input.value = input_value_value = /*item*/ ctx[0].value;
    			input.required = true;
    			attr(input, "placeholder", "Value");
    			attr(button1, "class", "rounded py-1 px-2 bg-green-800 text-white");
    			attr(form, "action", "");
    			attr(form, "class", "flex flex-wrap justify-between w-full");
    			attr(li, "class", "rounded mb-4 px-4 py-2 bg-gray-100");
    		},
    		m(target, anchor) {
    			insert(target, li, anchor);
    			append(li, form);
    			append(form, label);
    			append(label, t0);
    			/*label_binding*/ ctx[5](label);
    			append(form, t1);
    			append(form, button0);
    			append(button0, t2);
    			append(form, t3);
    			append(form, input);
    			/*input_binding*/ ctx[6](input);
    			append(form, t4);
    			append(form, button1);
    			append(button1, t5);

    			if (!mounted) {
    				dispose = [
    					listen(button0, "click", /*deleteConstant*/ ctx[4]),
    					listen(form, "submit", prevent_default(/*updateConstant*/ ctx[3]))
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*item*/ 1 && t0_value !== (t0_value = /*item*/ ctx[0].name + "")) set_data(t0, t0_value);

    			if (dirty & /*item*/ 1 && input_value_value !== (input_value_value = /*item*/ ctx[0].value) && input.value !== input_value_value) {
    				input.value = input_value_value;
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(li);
    			/*label_binding*/ ctx[5](null);
    			/*input_binding*/ ctx[6](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { item } = $$props;
    	let valueEl;
    	let nameEl;

    	const updateConstant = () => {
    		const name = item.name;
    		const value = valueEl.value;
    		api.setConstant(name, value).then(fetchConstants); // sorry, no sorry :)
    	};

    	const deleteConstant = () => {
    		const name = nameEl.textContent.trim();
    		api.unsetConstant(name).then(fetchConstants); // sorry, no sorry :)
    	};

    	function label_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			nameEl = $$value;
    			$$invalidate(2, nameEl);
    		});
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			valueEl = $$value;
    			$$invalidate(1, valueEl);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("item" in $$props) $$invalidate(0, item = $$props.item);
    	};

    	return [
    		item,
    		valueEl,
    		nameEl,
    		updateConstant,
    		deleteConstant,
    		label_binding,
    		input_binding
    	];
    }

    class Item$2 extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$1(this, options, instance$i, create_fragment$i, safe_not_equal, { item: 0 });
    	}
    }

    var Item$3 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Item$2
    });

    /* src\pages\Constants\NewItem.svelte generated by Svelte v3.24.1 */

    function create_fragment$h(ctx) {
    	let li;
    	let h2;
    	let t0;
    	let t1;
    	let form;
    	let input0;
    	let t2;
    	let input1;
    	let t3;
    	let button;
    	let t4;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			li = element("li");
    			h2 = element("h2");
    			t0 = text("New item");
    			t1 = space();
    			form = element("form");
    			input0 = element("input");
    			t2 = space();
    			input1 = element("input");
    			t3 = space();
    			button = element("button");
    			t4 = text("Save");
    			this.h();
    		},
    		l(nodes) {
    			li = claim_element(nodes, "LI", { class: true });
    			var li_nodes = children(li);
    			h2 = claim_element(li_nodes, "H2", { class: true });
    			var h2_nodes = children(h2);
    			t0 = claim_text(h2_nodes, "New item");
    			h2_nodes.forEach(detach);
    			t1 = claim_space(li_nodes);
    			form = claim_element(li_nodes, "FORM", { action: true, class: true });
    			var form_nodes = children(form);

    			input0 = claim_element(form_nodes, "INPUT", {
    				class: true,
    				type: true,
    				value: true,
    				required: true,
    				placeholder: true
    			});

    			t2 = claim_space(form_nodes);

    			input1 = claim_element(form_nodes, "INPUT", {
    				class: true,
    				type: true,
    				value: true,
    				required: true,
    				placeholder: true
    			});

    			t3 = claim_space(form_nodes);
    			button = claim_element(form_nodes, "BUTTON", { class: true });
    			var button_nodes = children(button);
    			t4 = claim_text(button_nodes, "Save");
    			button_nodes.forEach(detach);
    			form_nodes.forEach(detach);
    			li_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(h2, "class", "font-semibold mb-2");
    			attr(input0, "class", "w-1/2 mb-2 rounded px-2 py-1 bg-white text-gray-600");
    			attr(input0, "type", "text");
    			input0.value = "";
    			input0.required = true;
    			attr(input0, "placeholder", "Name");
    			attr(input1, "class", "rounded w-full px-2 py-1 mb-2 bg-white text-gray-600");
    			attr(input1, "type", "text");
    			input1.value = "";
    			input1.required = true;
    			attr(input1, "placeholder", "Value");
    			attr(button, "class", "rounded py-1 px-2 bg-green-800 text-white");
    			attr(form, "action", "");
    			attr(form, "class", "flex flex-wrap justify-between w-full");
    			attr(li, "class", "rounded mb-3 px-4 py-2 bg-gray-100");
    		},
    		m(target, anchor) {
    			insert(target, li, anchor);
    			append(li, h2);
    			append(h2, t0);
    			append(li, t1);
    			append(li, form);
    			append(form, input0);
    			/*input0_binding*/ ctx[3](input0);
    			append(form, t2);
    			append(form, input1);
    			/*input1_binding*/ ctx[4](input1);
    			append(form, t3);
    			append(form, button);
    			append(button, t4);

    			if (!mounted) {
    				dispose = listen(form, "submit", prevent_default(/*updateConstant*/ ctx[2]));
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(li);
    			/*input0_binding*/ ctx[3](null);
    			/*input1_binding*/ ctx[4](null);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let valueEl;
    	let nameEl;

    	const updateConstant = () => {
    		api.setConstant(nameEl.value, valueEl.value).then(fetchConstants).then(() => {
    			$$invalidate(0, valueEl.value = "", valueEl);
    			$$invalidate(1, nameEl.value = "", nameEl);
    		});
    	};

    	function input0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			nameEl = $$value;
    			$$invalidate(1, nameEl);
    		});
    	}

    	function input1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			valueEl = $$value;
    			$$invalidate(0, valueEl);
    		});
    	}

    	return [valueEl, nameEl, updateConstant, input0_binding, input1_binding];
    }

    class NewItem extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$1(this, options, instance$h, create_fragment$h, safe_not_equal, {});
    	}
    }

    var NewItem$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': NewItem
    });

    /* src\pages\Constants\index.svelte generated by Svelte v3.24.1 */

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (12:2) {#each $constants as item (item.name)}
    function create_each_block$6(key_1, ctx) {
    	let first;
    	let item;
    	let current;
    	item = new Item$2({ props: { item: /*item*/ ctx[1] } });

    	return {
    		key: key_1,
    		first: null,
    		c() {
    			first = empty();
    			create_component(item.$$.fragment);
    			this.h();
    		},
    		l(nodes) {
    			first = empty();
    			claim_component(item.$$.fragment, nodes);
    			this.h();
    		},
    		h() {
    			this.first = first;
    		},
    		m(target, anchor) {
    			insert(target, first, anchor);
    			mount_component(item, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const item_changes = {};
    			if (dirty & /*$constants*/ 1) item_changes.item = /*item*/ ctx[1];
    			item.$set(item_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(item.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(item.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(first);
    			destroy_component(item, detaching);
    		}
    	};
    }

    function create_fragment$g(ctx) {
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t0;
    	let newitem;
    	let t1;
    	let details;
    	let current;
    	let each_value = /*$constants*/ ctx[0];
    	const get_key = ctx => /*item*/ ctx[1].name;

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$6(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$6(key, child_ctx));
    	}

    	newitem = new NewItem({});
    	details = new Details({});

    	return {
    		c() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			create_component(newitem.$$.fragment);
    			t1 = space();
    			create_component(details.$$.fragment);
    			this.h();
    		},
    		l(nodes) {
    			ul = claim_element(nodes, "UL", { class: true });
    			var ul_nodes = children(ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(ul_nodes);
    			}

    			t0 = claim_space(ul_nodes);
    			claim_component(newitem.$$.fragment, ul_nodes);
    			t1 = claim_space(ul_nodes);
    			claim_component(details.$$.fragment, ul_nodes);
    			ul_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(ul, "class", "pb-4");
    		},
    		m(target, anchor) {
    			insert(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append(ul, t0);
    			mount_component(newitem, ul, null);
    			append(ul, t1);
    			mount_component(details, ul, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*$constants*/ 1) {
    				const each_value = /*$constants*/ ctx[0];
    				group_outros();
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, outro_and_destroy_block, create_each_block$6, t0, get_each_context$6);
    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(newitem.$$.fragment, local);
    			transition_in(details.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(newitem.$$.fragment, local);
    			transition_out(details.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			destroy_component(newitem);
    			destroy_component(details);
    		}
    	};
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let $constants;
    	component_subscribe($$self, constants, $$value => $$invalidate(0, $constants = $$value));
    	fetchConstants();
    	return [$constants];
    }

    class Constants extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$1(this, options, instance$g, create_fragment$g, safe_not_equal, {});
    	}
    }

    var index$4 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Constants
    });

    /* src\pages\index.svelte generated by Svelte v3.24.1 */

    function create_fragment$f(ctx) {
    	let section0;
    	let div17;
    	let div16;
    	let div3;
    	let div2;
    	let div0;
    	let svg0;
    	let path0;
    	let t0;
    	let div1;
    	let h20;
    	let t1;
    	let t2;
    	let ul0;
    	let li0;
    	let t3;
    	let t4;
    	let li1;
    	let t5;
    	let t6;
    	let a0;
    	let t7;
    	let svg1;
    	let path1;
    	let a0_href_value;
    	let t8;
    	let div7;
    	let div6;
    	let div4;
    	let svg2;
    	let path2;
    	let t9;
    	let div5;
    	let h21;
    	let t10;
    	let t11;
    	let ul1;
    	let li2;
    	let t12;
    	let t13;
    	let li3;
    	let t14;
    	let t15;
    	let a1;
    	let t16;
    	let svg3;
    	let path3;
    	let a1_href_value;
    	let t17;
    	let div11;
    	let div10;
    	let div8;
    	let svg4;
    	let path4;
    	let t18;
    	let div9;
    	let h22;
    	let t19;
    	let t20;
    	let ul2;
    	let li4;
    	let t21;
    	let t22;
    	let li5;
    	let t23;
    	let t24;
    	let a2;
    	let t25;
    	let svg5;
    	let path5;
    	let a2_href_value;
    	let t26;
    	let div15;
    	let div14;
    	let div12;
    	let svg6;
    	let path6;
    	let t27;
    	let div13;
    	let h23;
    	let t28;
    	let t29;
    	let ul3;
    	let li6;
    	let t30;
    	let t31;
    	let li7;
    	let t32;
    	let t33;
    	let a3;
    	let t34;
    	let svg7;
    	let path7;
    	let a3_href_value;
    	let t35;
    	let hr0;
    	let t36;
    	let section1;
    	let div25;
    	let div24;
    	let div20;
    	let div19;
    	let img0;
    	let img0_src_value;
    	let t37;
    	let div18;
    	let h24;
    	let t38;
    	let t39;
    	let ul4;
    	let li8;
    	let t40;
    	let t41;
    	let li9;
    	let t42;
    	let t43;
    	let li10;
    	let t44;
    	let t45;
    	let a4;
    	let t46;
    	let svg8;
    	let path8;
    	let t47;
    	let div23;
    	let div22;
    	let img1;
    	let img1_src_value;
    	let t48;
    	let div21;
    	let h25;
    	let t49;
    	let t50;
    	let ul5;
    	let li11;
    	let t51;
    	let t52;
    	let li12;
    	let t53;
    	let t54;
    	let li13;
    	let t55;
    	let t56;
    	let a5;
    	let t57;
    	let svg9;
    	let path9;
    	let t58;
    	let hr1;
    	let t59;
    	let div27;
    	let section2;
    	let div26;
    	let h26;
    	let t60;
    	let t61;
    	let p;
    	let t62;
    	let t63;
    	let a6;
    	let t64;
    	let svg10;
    	let path10;
    	let t65;
    	let img2;
    	let img2_src_value;

    	return {
    		c() {
    			section0 = element("section");
    			div17 = element("div");
    			div16 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t0 = space();
    			div1 = element("div");
    			h20 = element("h2");
    			t1 = text("Manage database records in your application");
    			t2 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			t3 = text("Inspect tables and schemas");
    			t4 = space();
    			li1 = element("li");
    			t5 = text("Manage records (create, read, update, delete)");
    			t6 = space();
    			a0 = element("a");
    			t7 = text("Go to Records\r\n              ");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t8 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div4 = element("div");
    			svg2 = svg_element("svg");
    			path2 = svg_element("path");
    			t9 = space();
    			div5 = element("div");
    			h21 = element("h2");
    			t10 = text("Manage users");
    			t11 = space();
    			ul1 = element("ul");
    			li2 = element("li");
    			t12 = text("Inspect registered users");
    			t13 = space();
    			li3 = element("li");
    			t14 = text("Manage users (create, read, update, delete)");
    			t15 = space();
    			a1 = element("a");
    			t16 = text("Go to Users\r\n              ");
    			svg3 = svg_element("svg");
    			path3 = svg_element("path");
    			t17 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div8 = element("div");
    			svg4 = svg_element("svg");
    			path4 = svg_element("path");
    			t18 = space();
    			div9 = element("div");
    			h22 = element("h2");
    			t19 = text("Instance Logs");
    			t20 = space();
    			ul2 = element("ul");
    			li4 = element("li");
    			t21 = text("View system logs about performance and others");
    			t22 = space();
    			li5 = element("li");
    			t23 = text("View your own logs");
    			t24 = space();
    			a2 = element("a");
    			t25 = text("Go to Logs\r\n              ");
    			svg5 = svg_element("svg");
    			path5 = svg_element("path");
    			t26 = space();
    			div15 = element("div");
    			div14 = element("div");
    			div12 = element("div");
    			svg6 = svg_element("svg");
    			path6 = svg_element("path");
    			t27 = space();
    			div13 = element("div");
    			h23 = element("h2");
    			t28 = text("Constants editor");
    			t29 = space();
    			ul3 = element("ul");
    			li6 = element("li");
    			t30 = text("Check all constants in one place");
    			t31 = space();
    			li7 = element("li");
    			t32 = text("Create, delete, update");
    			t33 = space();
    			a3 = element("a");
    			t34 = text("Go to Constants editor\r\n              ");
    			svg7 = svg_element("svg");
    			path7 = svg_element("path");
    			t35 = space();
    			hr0 = element("hr");
    			t36 = space();
    			section1 = element("section");
    			div25 = element("div");
    			div24 = element("div");
    			div20 = element("div");
    			div19 = element("div");
    			img0 = element("img");
    			t37 = space();
    			div18 = element("div");
    			h24 = element("h2");
    			t38 = text("Liquid Evaluator");
    			t39 = space();
    			ul4 = element("ul");
    			li8 = element("li");
    			t40 = text("Run Liquid code against your instance");
    			t41 = space();
    			li9 = element("li");
    			t42 = text("Test Liquid logic");
    			t43 = space();
    			li10 = element("li");
    			t44 = text("Quickly prototype your ideas");
    			t45 = space();
    			a4 = element("a");
    			t46 = text("Go to Liquid Evaluator\r\n              ");
    			svg8 = svg_element("svg");
    			path8 = svg_element("path");
    			t47 = space();
    			div23 = element("div");
    			div22 = element("div");
    			img1 = element("img");
    			t48 = space();
    			div21 = element("div");
    			h25 = element("h2");
    			t49 = text("GraphiQL");
    			t50 = space();
    			ul5 = element("ul");
    			li11 = element("li");
    			t51 = text("Run GraphQL against your instance");
    			t52 = space();
    			li12 = element("li");
    			t53 = text("Explore documentation");
    			t54 = space();
    			li13 = element("li");
    			t55 = text("Quickly prototype your queries and mutations");
    			t56 = space();
    			a5 = element("a");
    			t57 = text("Go to GraphiQL\r\n              ");
    			svg9 = svg_element("svg");
    			path9 = svg_element("path");
    			t58 = space();
    			hr1 = element("hr");
    			t59 = space();
    			div27 = element("div");
    			section2 = element("section");
    			div26 = element("div");
    			h26 = element("h2");
    			t60 = text("Try the new pos-cli gui");
    			t61 = space();
    			p = element("p");
    			t62 = text("Fully operational public beta version available");
    			t63 = space();
    			a6 = element("a");
    			t64 = text("Try it\r\n        ");
    			svg10 = svg_element("svg");
    			path10 = svg_element("path");
    			t65 = space();
    			img2 = element("img");
    			this.h();
    		},
    		l(nodes) {
    			section0 = claim_element(nodes, "SECTION", { class: true });
    			var section0_nodes = children(section0);
    			div17 = claim_element(section0_nodes, "DIV", { class: true });
    			var div17_nodes = children(div17);
    			div16 = claim_element(div17_nodes, "DIV", { class: true });
    			var div16_nodes = children(div16);
    			div3 = claim_element(div16_nodes, "DIV", { class: true });
    			var div3_nodes = children(div3);
    			div2 = claim_element(div3_nodes, "DIV", { class: true });
    			var div2_nodes = children(div2);
    			div0 = claim_element(div2_nodes, "DIV", { class: true });
    			var div0_nodes = children(div0);

    			svg0 = claim_element(
    				div0_nodes,
    				"svg",
    				{
    					fill: true,
    					stroke: true,
    					"stroke-linecap": true,
    					"stroke-linejoin": true,
    					"stroke-width": true,
    					class: true,
    					viewBox: true
    				},
    				1
    			);

    			var svg0_nodes = children(svg0);
    			path0 = claim_element(svg0_nodes, "path", { d: true }, 1);
    			children(path0).forEach(detach);
    			svg0_nodes.forEach(detach);
    			div0_nodes.forEach(detach);
    			t0 = claim_space(div2_nodes);
    			div1 = claim_element(div2_nodes, "DIV", { class: true });
    			var div1_nodes = children(div1);
    			h20 = claim_element(div1_nodes, "H2", { class: true });
    			var h20_nodes = children(h20);
    			t1 = claim_text(h20_nodes, "Manage database records in your application");
    			h20_nodes.forEach(detach);
    			t2 = claim_space(div1_nodes);
    			ul0 = claim_element(div1_nodes, "UL", { class: true });
    			var ul0_nodes = children(ul0);
    			li0 = claim_element(ul0_nodes, "LI", {});
    			var li0_nodes = children(li0);
    			t3 = claim_text(li0_nodes, "Inspect tables and schemas");
    			li0_nodes.forEach(detach);
    			t4 = claim_space(ul0_nodes);
    			li1 = claim_element(ul0_nodes, "LI", {});
    			var li1_nodes = children(li1);
    			t5 = claim_text(li1_nodes, "Manage records (create, read, update, delete)");
    			li1_nodes.forEach(detach);
    			ul0_nodes.forEach(detach);
    			t6 = claim_space(div1_nodes);
    			a0 = claim_element(div1_nodes, "A", { href: true, class: true });
    			var a0_nodes = children(a0);
    			t7 = claim_text(a0_nodes, "Go to Records\r\n              ");

    			svg1 = claim_element(
    				a0_nodes,
    				"svg",
    				{
    					fill: true,
    					stroke: true,
    					"stroke-linecap": true,
    					"stroke-linejoin": true,
    					"stroke-width": true,
    					class: true,
    					viewBox: true
    				},
    				1
    			);

    			var svg1_nodes = children(svg1);
    			path1 = claim_element(svg1_nodes, "path", { d: true }, 1);
    			children(path1).forEach(detach);
    			svg1_nodes.forEach(detach);
    			a0_nodes.forEach(detach);
    			div1_nodes.forEach(detach);
    			div2_nodes.forEach(detach);
    			div3_nodes.forEach(detach);
    			t8 = claim_space(div16_nodes);
    			div7 = claim_element(div16_nodes, "DIV", { class: true });
    			var div7_nodes = children(div7);
    			div6 = claim_element(div7_nodes, "DIV", { class: true });
    			var div6_nodes = children(div6);
    			div4 = claim_element(div6_nodes, "DIV", { class: true });
    			var div4_nodes = children(div4);

    			svg2 = claim_element(
    				div4_nodes,
    				"svg",
    				{
    					fill: true,
    					stroke: true,
    					"stroke-linecap": true,
    					"stroke-linejoin": true,
    					"stroke-width": true,
    					class: true,
    					viewBox: true
    				},
    				1
    			);

    			var svg2_nodes = children(svg2);
    			path2 = claim_element(svg2_nodes, "path", { d: true }, 1);
    			children(path2).forEach(detach);
    			svg2_nodes.forEach(detach);
    			div4_nodes.forEach(detach);
    			t9 = claim_space(div6_nodes);
    			div5 = claim_element(div6_nodes, "DIV", { class: true });
    			var div5_nodes = children(div5);
    			h21 = claim_element(div5_nodes, "H2", { class: true });
    			var h21_nodes = children(h21);
    			t10 = claim_text(h21_nodes, "Manage users");
    			h21_nodes.forEach(detach);
    			t11 = claim_space(div5_nodes);
    			ul1 = claim_element(div5_nodes, "UL", { class: true });
    			var ul1_nodes = children(ul1);
    			li2 = claim_element(ul1_nodes, "LI", {});
    			var li2_nodes = children(li2);
    			t12 = claim_text(li2_nodes, "Inspect registered users");
    			li2_nodes.forEach(detach);
    			t13 = claim_space(ul1_nodes);
    			li3 = claim_element(ul1_nodes, "LI", {});
    			var li3_nodes = children(li3);
    			t14 = claim_text(li3_nodes, "Manage users (create, read, update, delete)");
    			li3_nodes.forEach(detach);
    			ul1_nodes.forEach(detach);
    			t15 = claim_space(div5_nodes);
    			a1 = claim_element(div5_nodes, "A", { href: true, class: true });
    			var a1_nodes = children(a1);
    			t16 = claim_text(a1_nodes, "Go to Users\r\n              ");

    			svg3 = claim_element(
    				a1_nodes,
    				"svg",
    				{
    					fill: true,
    					stroke: true,
    					"stroke-linecap": true,
    					"stroke-linejoin": true,
    					"stroke-width": true,
    					class: true,
    					viewBox: true
    				},
    				1
    			);

    			var svg3_nodes = children(svg3);
    			path3 = claim_element(svg3_nodes, "path", { d: true }, 1);
    			children(path3).forEach(detach);
    			svg3_nodes.forEach(detach);
    			a1_nodes.forEach(detach);
    			div5_nodes.forEach(detach);
    			div6_nodes.forEach(detach);
    			div7_nodes.forEach(detach);
    			t17 = claim_space(div16_nodes);
    			div11 = claim_element(div16_nodes, "DIV", { class: true });
    			var div11_nodes = children(div11);
    			div10 = claim_element(div11_nodes, "DIV", { class: true });
    			var div10_nodes = children(div10);
    			div8 = claim_element(div10_nodes, "DIV", { class: true });
    			var div8_nodes = children(div8);

    			svg4 = claim_element(
    				div8_nodes,
    				"svg",
    				{
    					fill: true,
    					stroke: true,
    					"stroke-linecap": true,
    					"stroke-linejoin": true,
    					"stroke-width": true,
    					class: true,
    					viewBox: true
    				},
    				1
    			);

    			var svg4_nodes = children(svg4);
    			path4 = claim_element(svg4_nodes, "path", { d: true }, 1);
    			children(path4).forEach(detach);
    			svg4_nodes.forEach(detach);
    			div8_nodes.forEach(detach);
    			t18 = claim_space(div10_nodes);
    			div9 = claim_element(div10_nodes, "DIV", { class: true });
    			var div9_nodes = children(div9);
    			h22 = claim_element(div9_nodes, "H2", { class: true });
    			var h22_nodes = children(h22);
    			t19 = claim_text(h22_nodes, "Instance Logs");
    			h22_nodes.forEach(detach);
    			t20 = claim_space(div9_nodes);
    			ul2 = claim_element(div9_nodes, "UL", { class: true });
    			var ul2_nodes = children(ul2);
    			li4 = claim_element(ul2_nodes, "LI", {});
    			var li4_nodes = children(li4);
    			t21 = claim_text(li4_nodes, "View system logs about performance and others");
    			li4_nodes.forEach(detach);
    			t22 = claim_space(ul2_nodes);
    			li5 = claim_element(ul2_nodes, "LI", {});
    			var li5_nodes = children(li5);
    			t23 = claim_text(li5_nodes, "View your own logs");
    			li5_nodes.forEach(detach);
    			ul2_nodes.forEach(detach);
    			t24 = claim_space(div9_nodes);
    			a2 = claim_element(div9_nodes, "A", { href: true, class: true });
    			var a2_nodes = children(a2);
    			t25 = claim_text(a2_nodes, "Go to Logs\r\n              ");

    			svg5 = claim_element(
    				a2_nodes,
    				"svg",
    				{
    					fill: true,
    					stroke: true,
    					"stroke-linecap": true,
    					"stroke-linejoin": true,
    					"stroke-width": true,
    					class: true,
    					viewBox: true
    				},
    				1
    			);

    			var svg5_nodes = children(svg5);
    			path5 = claim_element(svg5_nodes, "path", { d: true }, 1);
    			children(path5).forEach(detach);
    			svg5_nodes.forEach(detach);
    			a2_nodes.forEach(detach);
    			div9_nodes.forEach(detach);
    			div10_nodes.forEach(detach);
    			div11_nodes.forEach(detach);
    			t26 = claim_space(div16_nodes);
    			div15 = claim_element(div16_nodes, "DIV", { class: true });
    			var div15_nodes = children(div15);
    			div14 = claim_element(div15_nodes, "DIV", { class: true });
    			var div14_nodes = children(div14);
    			div12 = claim_element(div14_nodes, "DIV", { class: true });
    			var div12_nodes = children(div12);

    			svg6 = claim_element(
    				div12_nodes,
    				"svg",
    				{
    					fill: true,
    					stroke: true,
    					"stroke-linecap": true,
    					"stroke-linejoin": true,
    					"stroke-width": true,
    					class: true,
    					viewBox: true
    				},
    				1
    			);

    			var svg6_nodes = children(svg6);
    			path6 = claim_element(svg6_nodes, "path", { d: true }, 1);
    			children(path6).forEach(detach);
    			svg6_nodes.forEach(detach);
    			div12_nodes.forEach(detach);
    			t27 = claim_space(div14_nodes);
    			div13 = claim_element(div14_nodes, "DIV", { class: true });
    			var div13_nodes = children(div13);
    			h23 = claim_element(div13_nodes, "H2", { class: true });
    			var h23_nodes = children(h23);
    			t28 = claim_text(h23_nodes, "Constants editor");
    			h23_nodes.forEach(detach);
    			t29 = claim_space(div13_nodes);
    			ul3 = claim_element(div13_nodes, "UL", { class: true });
    			var ul3_nodes = children(ul3);
    			li6 = claim_element(ul3_nodes, "LI", {});
    			var li6_nodes = children(li6);
    			t30 = claim_text(li6_nodes, "Check all constants in one place");
    			li6_nodes.forEach(detach);
    			t31 = claim_space(ul3_nodes);
    			li7 = claim_element(ul3_nodes, "LI", {});
    			var li7_nodes = children(li7);
    			t32 = claim_text(li7_nodes, "Create, delete, update");
    			li7_nodes.forEach(detach);
    			ul3_nodes.forEach(detach);
    			t33 = claim_space(div13_nodes);
    			a3 = claim_element(div13_nodes, "A", { href: true, class: true });
    			var a3_nodes = children(a3);
    			t34 = claim_text(a3_nodes, "Go to Constants editor\r\n              ");

    			svg7 = claim_element(
    				a3_nodes,
    				"svg",
    				{
    					fill: true,
    					stroke: true,
    					"stroke-linecap": true,
    					"stroke-linejoin": true,
    					"stroke-width": true,
    					class: true,
    					viewBox: true
    				},
    				1
    			);

    			var svg7_nodes = children(svg7);
    			path7 = claim_element(svg7_nodes, "path", { d: true }, 1);
    			children(path7).forEach(detach);
    			svg7_nodes.forEach(detach);
    			a3_nodes.forEach(detach);
    			div13_nodes.forEach(detach);
    			div14_nodes.forEach(detach);
    			div15_nodes.forEach(detach);
    			div16_nodes.forEach(detach);
    			div17_nodes.forEach(detach);
    			section0_nodes.forEach(detach);
    			t35 = claim_space(nodes);
    			hr0 = claim_element(nodes, "HR", {});
    			t36 = claim_space(nodes);
    			section1 = claim_element(nodes, "SECTION", { class: true });
    			var section1_nodes = children(section1);
    			div25 = claim_element(section1_nodes, "DIV", { class: true });
    			var div25_nodes = children(div25);
    			div24 = claim_element(div25_nodes, "DIV", { class: true });
    			var div24_nodes = children(div24);
    			div20 = claim_element(div24_nodes, "DIV", { class: true });
    			var div20_nodes = children(div20);
    			div19 = claim_element(div20_nodes, "DIV", { class: true });
    			var div19_nodes = children(div19);
    			img0 = claim_element(div19_nodes, "IMG", { src: true, alt: true, class: true });
    			t37 = claim_space(div19_nodes);
    			div18 = claim_element(div19_nodes, "DIV", { class: true });
    			var div18_nodes = children(div18);
    			h24 = claim_element(div18_nodes, "H2", { class: true });
    			var h24_nodes = children(h24);
    			t38 = claim_text(h24_nodes, "Liquid Evaluator");
    			h24_nodes.forEach(detach);
    			t39 = claim_space(div18_nodes);
    			ul4 = claim_element(div18_nodes, "UL", { class: true });
    			var ul4_nodes = children(ul4);
    			li8 = claim_element(ul4_nodes, "LI", {});
    			var li8_nodes = children(li8);
    			t40 = claim_text(li8_nodes, "Run Liquid code against your instance");
    			li8_nodes.forEach(detach);
    			t41 = claim_space(ul4_nodes);
    			li9 = claim_element(ul4_nodes, "LI", {});
    			var li9_nodes = children(li9);
    			t42 = claim_text(li9_nodes, "Test Liquid logic");
    			li9_nodes.forEach(detach);
    			t43 = claim_space(ul4_nodes);
    			li10 = claim_element(ul4_nodes, "LI", {});
    			var li10_nodes = children(li10);
    			t44 = claim_text(li10_nodes, "Quickly prototype your ideas");
    			li10_nodes.forEach(detach);
    			ul4_nodes.forEach(detach);
    			t45 = claim_space(div18_nodes);
    			a4 = claim_element(div18_nodes, "A", { href: true, target: true, class: true });
    			var a4_nodes = children(a4);
    			t46 = claim_text(a4_nodes, "Go to Liquid Evaluator\r\n              ");

    			svg8 = claim_element(
    				a4_nodes,
    				"svg",
    				{
    					fill: true,
    					stroke: true,
    					"stroke-linecap": true,
    					"stroke-linejoin": true,
    					"stroke-width": true,
    					class: true,
    					viewBox: true
    				},
    				1
    			);

    			var svg8_nodes = children(svg8);
    			path8 = claim_element(svg8_nodes, "path", { d: true }, 1);
    			children(path8).forEach(detach);
    			svg8_nodes.forEach(detach);
    			a4_nodes.forEach(detach);
    			div18_nodes.forEach(detach);
    			div19_nodes.forEach(detach);
    			div20_nodes.forEach(detach);
    			t47 = claim_space(div24_nodes);
    			div23 = claim_element(div24_nodes, "DIV", { class: true });
    			var div23_nodes = children(div23);
    			div22 = claim_element(div23_nodes, "DIV", { class: true });
    			var div22_nodes = children(div22);
    			img1 = claim_element(div22_nodes, "IMG", { src: true, alt: true, class: true });
    			t48 = claim_space(div22_nodes);
    			div21 = claim_element(div22_nodes, "DIV", { class: true });
    			var div21_nodes = children(div21);
    			h25 = claim_element(div21_nodes, "H2", { class: true });
    			var h25_nodes = children(h25);
    			t49 = claim_text(h25_nodes, "GraphiQL");
    			h25_nodes.forEach(detach);
    			t50 = claim_space(div21_nodes);
    			ul5 = claim_element(div21_nodes, "UL", { class: true });
    			var ul5_nodes = children(ul5);
    			li11 = claim_element(ul5_nodes, "LI", {});
    			var li11_nodes = children(li11);
    			t51 = claim_text(li11_nodes, "Run GraphQL against your instance");
    			li11_nodes.forEach(detach);
    			t52 = claim_space(ul5_nodes);
    			li12 = claim_element(ul5_nodes, "LI", {});
    			var li12_nodes = children(li12);
    			t53 = claim_text(li12_nodes, "Explore documentation");
    			li12_nodes.forEach(detach);
    			t54 = claim_space(ul5_nodes);
    			li13 = claim_element(ul5_nodes, "LI", {});
    			var li13_nodes = children(li13);
    			t55 = claim_text(li13_nodes, "Quickly prototype your queries and mutations");
    			li13_nodes.forEach(detach);
    			ul5_nodes.forEach(detach);
    			t56 = claim_space(div21_nodes);
    			a5 = claim_element(div21_nodes, "A", { href: true, target: true, class: true });
    			var a5_nodes = children(a5);
    			t57 = claim_text(a5_nodes, "Go to GraphiQL\r\n              ");

    			svg9 = claim_element(
    				a5_nodes,
    				"svg",
    				{
    					fill: true,
    					stroke: true,
    					"stroke-linecap": true,
    					"stroke-linejoin": true,
    					"stroke-width": true,
    					class: true,
    					viewBox: true
    				},
    				1
    			);

    			var svg9_nodes = children(svg9);
    			path9 = claim_element(svg9_nodes, "path", { d: true }, 1);
    			children(path9).forEach(detach);
    			svg9_nodes.forEach(detach);
    			a5_nodes.forEach(detach);
    			div21_nodes.forEach(detach);
    			div22_nodes.forEach(detach);
    			div23_nodes.forEach(detach);
    			div24_nodes.forEach(detach);
    			div25_nodes.forEach(detach);
    			section1_nodes.forEach(detach);
    			t58 = claim_space(nodes);
    			hr1 = claim_element(nodes, "HR", {});
    			t59 = claim_space(nodes);
    			div27 = claim_element(nodes, "DIV", { class: true });
    			var div27_nodes = children(div27);
    			section2 = claim_element(div27_nodes, "SECTION", { class: true, style: true });
    			var section2_nodes = children(section2);
    			div26 = claim_element(section2_nodes, "DIV", {});
    			var div26_nodes = children(div26);
    			h26 = claim_element(div26_nodes, "H2", { class: true });
    			var h26_nodes = children(h26);
    			t60 = claim_text(h26_nodes, "Try the new pos-cli gui");
    			h26_nodes.forEach(detach);
    			t61 = claim_space(div26_nodes);
    			p = claim_element(div26_nodes, "P", { class: true });
    			var p_nodes = children(p);
    			t62 = claim_text(p_nodes, "Fully operational public beta version available");
    			p_nodes.forEach(detach);
    			t63 = claim_space(div26_nodes);
    			a6 = claim_element(div26_nodes, "A", { href: true, class: true });
    			var a6_nodes = children(a6);
    			t64 = claim_text(a6_nodes, "Try it\r\n        ");

    			svg10 = claim_element(
    				a6_nodes,
    				"svg",
    				{
    					fill: true,
    					stroke: true,
    					"stroke-linecap": true,
    					"stroke-linejoin": true,
    					"stroke-width": true,
    					class: true,
    					viewBox: true
    				},
    				1
    			);

    			var svg10_nodes = children(svg10);
    			path10 = claim_element(svg10_nodes, "path", { d: true }, 1);
    			children(path10).forEach(detach);
    			svg10_nodes.forEach(detach);
    			a6_nodes.forEach(detach);
    			div26_nodes.forEach(detach);
    			t65 = claim_space(section2_nodes);

    			img2 = claim_element(section2_nodes, "IMG", {
    				src: true,
    				alt: true,
    				width: true,
    				height: true
    			});

    			section2_nodes.forEach(detach);
    			div27_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(path0, "d", "M22 12h-4l-3 9L9 3l-3 9H2");
    			attr(svg0, "fill", "none");
    			attr(svg0, "stroke", "currentColor");
    			attr(svg0, "stroke-linecap", "round");
    			attr(svg0, "stroke-linejoin", "round");
    			attr(svg0, "stroke-width", "2");
    			attr(svg0, "class", "w-8 h-8");
    			attr(svg0, "viewBox", "0 0 24 24");
    			attr(div0, "class", "inline-flex items-center justify-center flex-shrink-0 w-16 h-16 mb-4 text-blue-500 bg-blue-100 rounded-full sm:mr-8 sm:mb-0");
    			attr(h20, "class", "mb-3 text-lg font-medium text-gray-900 title-font");
    			attr(ul0, "class", "list-disc list-inside");
    			attr(path1, "d", "M5 12h14M12 5l7 7-7 7");
    			attr(svg1, "fill", "none");
    			attr(svg1, "stroke", "currentColor");
    			attr(svg1, "stroke-linecap", "round");
    			attr(svg1, "stroke-linejoin", "round");
    			attr(svg1, "stroke-width", "2");
    			attr(svg1, "class", "w-4 h-4 ml-2");
    			attr(svg1, "viewBox", "0 0 24 24");
    			attr(a0, "href", a0_href_value = /*$url*/ ctx[0]("../Models/index"));
    			attr(a0, "class", "inline-flex items-center mt-3 text-blue-500");
    			attr(div1, "class", "flex-grow ml-8");
    			attr(div2, "class", "flex p-8 border-2 border-gray-200 rounded-lg sm:flex-row");
    			attr(div3, "class", "p-4 lg:w-1/2 md:w-full");
    			attr(path2, "d", "M22 12h-4l-3 9L9 3l-3 9H2");
    			attr(svg2, "fill", "none");
    			attr(svg2, "stroke", "currentColor");
    			attr(svg2, "stroke-linecap", "round");
    			attr(svg2, "stroke-linejoin", "round");
    			attr(svg2, "stroke-width", "2");
    			attr(svg2, "class", "w-8 h-8");
    			attr(svg2, "viewBox", "0 0 24 24");
    			attr(div4, "class", "inline-flex items-center justify-center flex-shrink-0 w-16 h-16 mb-4 text-blue-500 bg-blue-100 rounded-full sm:mr-8 sm:mb-0");
    			attr(h21, "class", "mb-3 text-lg font-medium text-gray-900 title-font");
    			attr(ul1, "class", "list-disc list-inside");
    			attr(path3, "d", "M5 12h14M12 5l7 7-7 7");
    			attr(svg3, "fill", "none");
    			attr(svg3, "stroke", "currentColor");
    			attr(svg3, "stroke-linecap", "round");
    			attr(svg3, "stroke-linejoin", "round");
    			attr(svg3, "stroke-width", "2");
    			attr(svg3, "class", "w-4 h-4 ml-2");
    			attr(svg3, "viewBox", "0 0 24 24");
    			attr(a1, "href", a1_href_value = /*$url*/ ctx[0]("../Users/index"));
    			attr(a1, "class", "inline-flex items-center mt-3 text-blue-500");
    			attr(div5, "class", "flex-grow ml-8");
    			attr(div6, "class", "flex p-8 border-2 border-gray-200 rounded-lg sm:flex-row");
    			attr(div7, "class", "p-4 lg:w-1/2 md:w-full");
    			attr(path4, "d", "M22 12h-4l-3 9L9 3l-3 9H2");
    			attr(svg4, "fill", "none");
    			attr(svg4, "stroke", "currentColor");
    			attr(svg4, "stroke-linecap", "round");
    			attr(svg4, "stroke-linejoin", "round");
    			attr(svg4, "stroke-width", "2");
    			attr(svg4, "class", "w-8 h-8");
    			attr(svg4, "viewBox", "0 0 24 24");
    			attr(div8, "class", "inline-flex items-center justify-center flex-shrink-0 w-16 h-16 mb-4 text-blue-500 bg-blue-100 rounded-full sm:mr-8 sm:mb-0");
    			attr(h22, "class", "mb-3 text-lg font-medium text-gray-900 title-font");
    			attr(ul2, "class", "list-disc list-inside");
    			attr(path5, "d", "M5 12h14M12 5l7 7-7 7");
    			attr(svg5, "fill", "none");
    			attr(svg5, "stroke", "currentColor");
    			attr(svg5, "stroke-linecap", "round");
    			attr(svg5, "stroke-linejoin", "round");
    			attr(svg5, "stroke-width", "2");
    			attr(svg5, "class", "w-4 h-4 ml-2");
    			attr(svg5, "viewBox", "0 0 24 24");
    			attr(a2, "href", a2_href_value = /*$url*/ ctx[0]("/Logs"));
    			attr(a2, "class", "inline-flex items-center mt-3 text-blue-500");
    			attr(div9, "class", "flex-grow ml-8");
    			attr(div10, "class", "flex p-8 border-2 border-gray-200 rounded-lg sm:flex-row");
    			attr(div11, "class", "p-4 lg:w-1/2 md:w-full");
    			attr(path6, "d", "M22 12h-4l-3 9L9 3l-3 9H2");
    			attr(svg6, "fill", "none");
    			attr(svg6, "stroke", "currentColor");
    			attr(svg6, "stroke-linecap", "round");
    			attr(svg6, "stroke-linejoin", "round");
    			attr(svg6, "stroke-width", "2");
    			attr(svg6, "class", "w-8 h-8");
    			attr(svg6, "viewBox", "0 0 24 24");
    			attr(div12, "class", "inline-flex items-center justify-center flex-shrink-0 w-16 h-16 mb-4 text-blue-500 bg-blue-100 rounded-full sm:mr-8 sm:mb-0");
    			attr(h23, "class", "mb-3 text-lg font-medium text-gray-900 title-font");
    			attr(ul3, "class", "list-disc list-inside");
    			attr(path7, "d", "M5 12h14M12 5l7 7-7 7");
    			attr(svg7, "fill", "none");
    			attr(svg7, "stroke", "currentColor");
    			attr(svg7, "stroke-linecap", "round");
    			attr(svg7, "stroke-linejoin", "round");
    			attr(svg7, "stroke-width", "2");
    			attr(svg7, "class", "w-4 h-4 ml-2");
    			attr(svg7, "viewBox", "0 0 24 24");
    			attr(a3, "href", a3_href_value = /*$url*/ ctx[0]("/Constants"));
    			attr(a3, "class", "inline-flex items-center mt-3 text-blue-500");
    			attr(div13, "class", "flex-grow ml-8");
    			attr(div14, "class", "flex p-8 border-2 border-gray-200 rounded-lg sm:flex-row");
    			attr(div15, "class", "p-4 lg:w-1/2 md:w-full");
    			attr(div16, "class", "flex flex-wrap w-full -m-4");
    			attr(div17, "class", "container flex flex-wrap py-8 mx-auto");
    			attr(section0, "class", "text-gray-700 ");
    			if (img0.src !== (img0_src_value = "./dupa.png")) attr(img0, "src", img0_src_value);
    			attr(img0, "alt", "Liquid Evaluator");
    			attr(img0, "class", "w-1/3 mr-6 shadow-md");
    			attr(h24, "class", "mb-3 text-lg font-medium text-gray-900 title-font");
    			attr(ul4, "class", "text-sm list-disc list-inside");
    			attr(path8, "d", "M5 12h14M12 5l7 7-7 7");
    			attr(svg8, "fill", "none");
    			attr(svg8, "stroke", "currentColor");
    			attr(svg8, "stroke-linecap", "round");
    			attr(svg8, "stroke-linejoin", "round");
    			attr(svg8, "stroke-width", "2");
    			attr(svg8, "class", "w-4 h-4 ml-2");
    			attr(svg8, "viewBox", "0 0 24 24");
    			attr(a4, "href", "http://localhost:3333/gui/liquid");
    			attr(a4, "target", "_blank");
    			attr(a4, "class", "inline-flex items-center mt-3 text-blue-500");
    			attr(div18, "class", "flex-grow");
    			attr(div19, "class", "flex p-8 border-2 border-gray-200 rounded-lg");
    			attr(div20, "class", "p-4 lg:w-1/2 md:w-full");
    			if (img1.src !== (img1_src_value = "./graphiql.png")) attr(img1, "src", img1_src_value);
    			attr(img1, "alt", "Liquid Evaluator");
    			attr(img1, "class", "w-1/3 mr-6 shadow-md");
    			attr(h25, "class", "mb-3 text-lg font-medium text-gray-900 title-font");
    			attr(ul5, "class", "text-sm list-disc list-inside");
    			attr(path9, "d", "M5 12h14M12 5l7 7-7 7");
    			attr(svg9, "fill", "none");
    			attr(svg9, "stroke", "currentColor");
    			attr(svg9, "stroke-linecap", "round");
    			attr(svg9, "stroke-linejoin", "round");
    			attr(svg9, "stroke-width", "2");
    			attr(svg9, "class", "w-4 h-4 ml-2");
    			attr(svg9, "viewBox", "0 0 24 24");
    			attr(a5, "href", "http://localhost:3333/gui/graphql");
    			attr(a5, "target", "_blank");
    			attr(a5, "class", "inline-flex items-center mt-3 text-blue-500");
    			attr(div21, "class", "flex-grow");
    			attr(div22, "class", "flex p-8 border-2 border-gray-200 rounded-lg");
    			attr(div23, "class", "p-4 lg:w-1/2 md:w-full");
    			attr(div24, "class", "flex flex-wrap w-full -m-4");
    			attr(div25, "class", "container flex flex-wrap py-8 mx-auto");
    			attr(section1, "class", "text-gray-700 ");
    			attr(h26, "class", "mb-3 text-2xl font-medium text-gray-900 title-font");
    			attr(p, "class", "mb-8");
    			attr(path10, "d", "M5 12h14M12 5l7 7-7 7");
    			attr(svg10, "fill", "none");
    			attr(svg10, "stroke", "currentColor");
    			attr(svg10, "stroke-linecap", "round");
    			attr(svg10, "stroke-linejoin", "round");
    			attr(svg10, "stroke-width", "2");
    			attr(svg10, "class", "w-4 h-4");
    			attr(svg10, "viewBox", "0 0 24 24");
    			attr(a6, "href", "http://localhost:3333");
    			attr(a6, "class", "px-4 py-2 inline-flex items-center gap-4 bg-blue-500 text-white rounded");
    			if (img2.src !== (img2_src_value = "/tryNew.png")) attr(img2, "src", img2_src_value);
    			attr(img2, "alt", "");
    			attr(img2, "width", "473");
    			attr(img2, "height", "309");
    			attr(section2, "class", "w-full p-8 border-2 border-gray-200 rounded-lg bg-no-repeat bg-right flex flex-col gap-14 md:flex-row items-center justify-center");
    			set_style(section2, "min-height", "450px");
    			set_style(section2, "background-color", "#f5f6fc");
    			attr(div27, "class", "container flex flex-wrap py-8 mx-auto");
    		},
    		m(target, anchor) {
    			insert(target, section0, anchor);
    			append(section0, div17);
    			append(div17, div16);
    			append(div16, div3);
    			append(div3, div2);
    			append(div2, div0);
    			append(div0, svg0);
    			append(svg0, path0);
    			append(div2, t0);
    			append(div2, div1);
    			append(div1, h20);
    			append(h20, t1);
    			append(div1, t2);
    			append(div1, ul0);
    			append(ul0, li0);
    			append(li0, t3);
    			append(ul0, t4);
    			append(ul0, li1);
    			append(li1, t5);
    			append(div1, t6);
    			append(div1, a0);
    			append(a0, t7);
    			append(a0, svg1);
    			append(svg1, path1);
    			append(div16, t8);
    			append(div16, div7);
    			append(div7, div6);
    			append(div6, div4);
    			append(div4, svg2);
    			append(svg2, path2);
    			append(div6, t9);
    			append(div6, div5);
    			append(div5, h21);
    			append(h21, t10);
    			append(div5, t11);
    			append(div5, ul1);
    			append(ul1, li2);
    			append(li2, t12);
    			append(ul1, t13);
    			append(ul1, li3);
    			append(li3, t14);
    			append(div5, t15);
    			append(div5, a1);
    			append(a1, t16);
    			append(a1, svg3);
    			append(svg3, path3);
    			append(div16, t17);
    			append(div16, div11);
    			append(div11, div10);
    			append(div10, div8);
    			append(div8, svg4);
    			append(svg4, path4);
    			append(div10, t18);
    			append(div10, div9);
    			append(div9, h22);
    			append(h22, t19);
    			append(div9, t20);
    			append(div9, ul2);
    			append(ul2, li4);
    			append(li4, t21);
    			append(ul2, t22);
    			append(ul2, li5);
    			append(li5, t23);
    			append(div9, t24);
    			append(div9, a2);
    			append(a2, t25);
    			append(a2, svg5);
    			append(svg5, path5);
    			append(div16, t26);
    			append(div16, div15);
    			append(div15, div14);
    			append(div14, div12);
    			append(div12, svg6);
    			append(svg6, path6);
    			append(div14, t27);
    			append(div14, div13);
    			append(div13, h23);
    			append(h23, t28);
    			append(div13, t29);
    			append(div13, ul3);
    			append(ul3, li6);
    			append(li6, t30);
    			append(ul3, t31);
    			append(ul3, li7);
    			append(li7, t32);
    			append(div13, t33);
    			append(div13, a3);
    			append(a3, t34);
    			append(a3, svg7);
    			append(svg7, path7);
    			insert(target, t35, anchor);
    			insert(target, hr0, anchor);
    			insert(target, t36, anchor);
    			insert(target, section1, anchor);
    			append(section1, div25);
    			append(div25, div24);
    			append(div24, div20);
    			append(div20, div19);
    			append(div19, img0);
    			append(div19, t37);
    			append(div19, div18);
    			append(div18, h24);
    			append(h24, t38);
    			append(div18, t39);
    			append(div18, ul4);
    			append(ul4, li8);
    			append(li8, t40);
    			append(ul4, t41);
    			append(ul4, li9);
    			append(li9, t42);
    			append(ul4, t43);
    			append(ul4, li10);
    			append(li10, t44);
    			append(div18, t45);
    			append(div18, a4);
    			append(a4, t46);
    			append(a4, svg8);
    			append(svg8, path8);
    			append(div24, t47);
    			append(div24, div23);
    			append(div23, div22);
    			append(div22, img1);
    			append(div22, t48);
    			append(div22, div21);
    			append(div21, h25);
    			append(h25, t49);
    			append(div21, t50);
    			append(div21, ul5);
    			append(ul5, li11);
    			append(li11, t51);
    			append(ul5, t52);
    			append(ul5, li12);
    			append(li12, t53);
    			append(ul5, t54);
    			append(ul5, li13);
    			append(li13, t55);
    			append(div21, t56);
    			append(div21, a5);
    			append(a5, t57);
    			append(a5, svg9);
    			append(svg9, path9);
    			insert(target, t58, anchor);
    			insert(target, hr1, anchor);
    			insert(target, t59, anchor);
    			insert(target, div27, anchor);
    			append(div27, section2);
    			append(section2, div26);
    			append(div26, h26);
    			append(h26, t60);
    			append(div26, t61);
    			append(div26, p);
    			append(p, t62);
    			append(div26, t63);
    			append(div26, a6);
    			append(a6, t64);
    			append(a6, svg10);
    			append(svg10, path10);
    			append(section2, t65);
    			append(section2, img2);
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*$url*/ 1 && a0_href_value !== (a0_href_value = /*$url*/ ctx[0]("../Models/index"))) {
    				attr(a0, "href", a0_href_value);
    			}

    			if (dirty & /*$url*/ 1 && a1_href_value !== (a1_href_value = /*$url*/ ctx[0]("../Users/index"))) {
    				attr(a1, "href", a1_href_value);
    			}

    			if (dirty & /*$url*/ 1 && a2_href_value !== (a2_href_value = /*$url*/ ctx[0]("/Logs"))) {
    				attr(a2, "href", a2_href_value);
    			}

    			if (dirty & /*$url*/ 1 && a3_href_value !== (a3_href_value = /*$url*/ ctx[0]("/Constants"))) {
    				attr(a3, "href", a3_href_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(section0);
    			if (detaching) detach(t35);
    			if (detaching) detach(hr0);
    			if (detaching) detach(t36);
    			if (detaching) detach(section1);
    			if (detaching) detach(t58);
    			if (detaching) detach(hr1);
    			if (detaching) detach(t59);
    			if (detaching) detach(div27);
    		}
    	};
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let $url;
    	component_subscribe($$self, url, $$value => $$invalidate(0, $url = $$value));
    	return [$url];
    }

    class Pages extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$1(this, options, instance$f, create_fragment$f, safe_not_equal, {});
    	}
    }

    var index$3 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Pages
    });

    /* src\pages\Logs\_layout.svelte generated by Svelte v3.24.1 */

    function create_fragment$e(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	return {
    		c() {
    			if (default_slot) default_slot.c();
    		},
    		l(nodes) {
    			if (default_slot) default_slot.l(nodes);
    		},
    		m(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, $$slots];
    }

    class Layout$3 extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$1(this, options, instance$e, create_fragment$e, safe_not_equal, {});
    	}
    }

    var _layout$3 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Layout$3
    });

    const logs = writable([]);
    const cachedLastId = writable(null);
    const lastId = writable(null);
    const clearLogs = () => logs.set([]);

    const isBrowserTabFocused = () => !document.hidden;
    const scrollToBottom = () => {
      setTimeout(() => document.querySelector("footer").scrollIntoView(), 200);
    };
    function fetchLogs() {
      if (!isBrowserTabFocused() && get_store_value(cachedLastId))
        return;
      return fetch(`http://localhost:${parseInt(window.location.port)-1}/api/logs?lastId=${get_store_value(lastId)}`).then((res) => res.json()).then((res) => {
        if (!res.logs.length)
          return res;
        const newLogs = res.logs.map((item) => new LogEntry(item));
        logs.update((logs2) => logs2.concat(newLogs));
        cachedLastId.set(get_store_value(lastId));
        lastId.set(newLogs.slice(-1)[0].id);
        scrollToBottom();
      });
    }
    class LogEntry {
      constructor(data) {
        this.id = data.id || "missing";
        this.message = data.message || "missing";
        this.error_type = data.error_type || "missing";
        this.data = data.data || {};
        this.updated_at = data.updated_at || new Date();
        this.isHighlighted = !!this.error_type.match(/error/i);
      }
    }

    function toInteger(dirtyNumber) {
      if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
        return NaN;
      }

      var number = Number(dirtyNumber);

      if (isNaN(number)) {
        return number;
      }

      return number < 0 ? Math.ceil(number) : Math.floor(number);
    }

    function requiredArgs(required, args) {
      if (args.length < required) {
        throw new TypeError(required + ' argument' + (required > 1 ? 's' : '') + ' required, but only ' + args.length + ' present');
      }
    }

    /**
     * @name toDate
     * @category Common Helpers
     * @summary Convert the given argument to an instance of Date.
     *
     * @description
     * Convert the given argument to an instance of Date.
     *
     * If the argument is an instance of Date, the function returns its clone.
     *
     * If the argument is a number, it is treated as a timestamp.
     *
     * If the argument is none of the above, the function returns Invalid Date.
     *
     * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
     *
     * @param {Date|Number} argument - the value to convert
     * @returns {Date} the parsed date in the local time zone
     * @throws {TypeError} 1 argument required
     *
     * @example
     * // Clone the date:
     * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
     * //=> Tue Feb 11 2014 11:30:30
     *
     * @example
     * // Convert the timestamp to date:
     * const result = toDate(1392098430000)
     * //=> Tue Feb 11 2014 11:30:30
     */

    function toDate(argument) {
      requiredArgs(1, arguments);
      var argStr = Object.prototype.toString.call(argument); // Clone the date

      if (argument instanceof Date || typeof argument === 'object' && argStr === '[object Date]') {
        // Prevent the date to lose the milliseconds when passed to new Date() in IE10
        return new Date(argument.getTime());
      } else if (typeof argument === 'number' || argStr === '[object Number]') {
        return new Date(argument);
      } else {
        if ((typeof argument === 'string' || argStr === '[object String]') && typeof console !== 'undefined') {
          // eslint-disable-next-line no-console
          console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule"); // eslint-disable-next-line no-console

          console.warn(new Error().stack);
        }

        return new Date(NaN);
      }
    }

    /**
     * @name addMilliseconds
     * @category Millisecond Helpers
     * @summary Add the specified number of milliseconds to the given date.
     *
     * @description
     * Add the specified number of milliseconds to the given date.
     *
     * ### v2.0.0 breaking changes:
     *
     * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
     *
     * @param {Date|Number} date - the date to be changed
     * @param {Number} amount - the amount of milliseconds to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
     * @returns {Date} the new date with the milliseconds added
     * @throws {TypeError} 2 arguments required
     *
     * @example
     * // Add 750 milliseconds to 10 July 2014 12:45:30.000:
     * var result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
     * //=> Thu Jul 10 2014 12:45:30.750
     */

    function addMilliseconds(dirtyDate, dirtyAmount) {
      requiredArgs(2, arguments);
      var timestamp = toDate(dirtyDate).getTime();
      var amount = toInteger(dirtyAmount);
      return new Date(timestamp + amount);
    }

    var MILLISECONDS_IN_MINUTE = 60000;

    function getDateMillisecondsPart(date) {
      return date.getTime() % MILLISECONDS_IN_MINUTE;
    }
    /**
     * Google Chrome as of 67.0.3396.87 introduced timezones with offset that includes seconds.
     * They usually appear for dates that denote time before the timezones were introduced
     * (e.g. for 'Europe/Prague' timezone the offset is GMT+00:57:44 before 1 October 1891
     * and GMT+01:00:00 after that date)
     *
     * Date#getTimezoneOffset returns the offset in minutes and would return 57 for the example above,
     * which would lead to incorrect calculations.
     *
     * This function returns the timezone offset in milliseconds that takes seconds in account.
     */


    function getTimezoneOffsetInMilliseconds(dirtyDate) {
      var date = new Date(dirtyDate.getTime());
      var baseTimezoneOffset = Math.ceil(date.getTimezoneOffset());
      date.setSeconds(0, 0);
      var hasNegativeUTCOffset = baseTimezoneOffset > 0;
      var millisecondsPartOfTimezoneOffset = hasNegativeUTCOffset ? (MILLISECONDS_IN_MINUTE + getDateMillisecondsPart(date)) % MILLISECONDS_IN_MINUTE : getDateMillisecondsPart(date);
      return baseTimezoneOffset * MILLISECONDS_IN_MINUTE + millisecondsPartOfTimezoneOffset;
    }

    /**
     * @name startOfDay
     * @category Day Helpers
     * @summary Return the start of a day for the given date.
     *
     * @description
     * Return the start of a day for the given date.
     * The result will be in the local timezone.
     *
     * ### v2.0.0 breaking changes:
     *
     * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
     *
     * @param {Date|Number} date - the original date
     * @returns {Date} the start of a day
     * @throws {TypeError} 1 argument required
     *
     * @example
     * // The start of a day for 2 September 2014 11:55:00:
     * var result = startOfDay(new Date(2014, 8, 2, 11, 55, 0))
     * //=> Tue Sep 02 2014 00:00:00
     */

    function startOfDay(dirtyDate) {
      requiredArgs(1, arguments);
      var date = toDate(dirtyDate);
      date.setHours(0, 0, 0, 0);
      return date;
    }

    var MILLISECONDS_IN_DAY$1 = 86400000;
    /**
     * @name differenceInCalendarDays
     * @category Day Helpers
     * @summary Get the number of calendar days between the given dates.
     *
     * @description
     * Get the number of calendar days between the given dates. This means that the times are removed
     * from the dates and then the difference in days is calculated.
     *
     * ### v2.0.0 breaking changes:
     *
     * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
     *
     * @param {Date|Number} dateLeft - the later date
     * @param {Date|Number} dateRight - the earlier date
     * @returns {Number} the number of calendar days
     * @throws {TypeError} 2 arguments required
     *
     * @example
     * // How many calendar days are between
     * // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
     * var result = differenceInCalendarDays(
     *   new Date(2012, 6, 2, 0, 0),
     *   new Date(2011, 6, 2, 23, 0)
     * )
     * //=> 366
     * // How many calendar days are between
     * // 2 July 2011 23:59:00 and 3 July 2011 00:01:00?
     * var result = differenceInCalendarDays(
     *   new Date(2011, 6, 3, 0, 1),
     *   new Date(2011, 6, 2, 23, 59)
     * )
     * //=> 1
     */

    function differenceInCalendarDays(dirtyDateLeft, dirtyDateRight) {
      requiredArgs(2, arguments);
      var startOfDayLeft = startOfDay(dirtyDateLeft);
      var startOfDayRight = startOfDay(dirtyDateRight);
      var timestampLeft = startOfDayLeft.getTime() - getTimezoneOffsetInMilliseconds(startOfDayLeft);
      var timestampRight = startOfDayRight.getTime() - getTimezoneOffsetInMilliseconds(startOfDayRight); // Round the number of days to the nearest integer
      // because the number of milliseconds in a day is not constant
      // (e.g. it's different in the day of the daylight saving time clock shift)

      return Math.round((timestampLeft - timestampRight) / MILLISECONDS_IN_DAY$1);
    }

    /**
     * @name isValid
     * @category Common Helpers
     * @summary Is the given date valid?
     *
     * @description
     * Returns false if argument is Invalid Date and true otherwise.
     * Argument is converted to Date using `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
     * Invalid Date is a Date, whose time value is NaN.
     *
     * Time value of Date: http://es5.github.io/#x15.9.1.1
     *
     * ### v2.0.0 breaking changes:
     *
     * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
     *
     * - Now `isValid` doesn't throw an exception
     *   if the first argument is not an instance of Date.
     *   Instead, argument is converted beforehand using `toDate`.
     *
     *   Examples:
     *
     *   | `isValid` argument        | Before v2.0.0 | v2.0.0 onward |
     *   |---------------------------|---------------|---------------|
     *   | `new Date()`              | `true`        | `true`        |
     *   | `new Date('2016-01-01')`  | `true`        | `true`        |
     *   | `new Date('')`            | `false`       | `false`       |
     *   | `new Date(1488370835081)` | `true`        | `true`        |
     *   | `new Date(NaN)`           | `false`       | `false`       |
     *   | `'2016-01-01'`            | `TypeError`   | `false`       |
     *   | `''`                      | `TypeError`   | `false`       |
     *   | `1488370835081`           | `TypeError`   | `true`        |
     *   | `NaN`                     | `TypeError`   | `false`       |
     *
     *   We introduce this change to make *date-fns* consistent with ECMAScript behavior
     *   that try to coerce arguments to the expected type
     *   (which is also the case with other *date-fns* functions).
     *
     * @param {*} date - the date to check
     * @returns {Boolean} the date is valid
     * @throws {TypeError} 1 argument required
     *
     * @example
     * // For the valid date:
     * var result = isValid(new Date(2014, 1, 31))
     * //=> true
     *
     * @example
     * // For the value, convertable into a date:
     * var result = isValid(1393804800000)
     * //=> true
     *
     * @example
     * // For the invalid date:
     * var result = isValid(new Date(''))
     * //=> false
     */

    function isValid(dirtyDate) {
      requiredArgs(1, arguments);
      var date = toDate(dirtyDate);
      return !isNaN(date);
    }

    var formatDistanceLocale = {
      lessThanXSeconds: {
        one: 'less than a second',
        other: 'less than {{count}} seconds'
      },
      xSeconds: {
        one: '1 second',
        other: '{{count}} seconds'
      },
      halfAMinute: 'half a minute',
      lessThanXMinutes: {
        one: 'less than a minute',
        other: 'less than {{count}} minutes'
      },
      xMinutes: {
        one: '1 minute',
        other: '{{count}} minutes'
      },
      aboutXHours: {
        one: 'about 1 hour',
        other: 'about {{count}} hours'
      },
      xHours: {
        one: '1 hour',
        other: '{{count}} hours'
      },
      xDays: {
        one: '1 day',
        other: '{{count}} days'
      },
      aboutXWeeks: {
        one: 'about 1 week',
        other: 'about {{count}} weeks'
      },
      xWeeks: {
        one: '1 week',
        other: '{{count}} weeks'
      },
      aboutXMonths: {
        one: 'about 1 month',
        other: 'about {{count}} months'
      },
      xMonths: {
        one: '1 month',
        other: '{{count}} months'
      },
      aboutXYears: {
        one: 'about 1 year',
        other: 'about {{count}} years'
      },
      xYears: {
        one: '1 year',
        other: '{{count}} years'
      },
      overXYears: {
        one: 'over 1 year',
        other: 'over {{count}} years'
      },
      almostXYears: {
        one: 'almost 1 year',
        other: 'almost {{count}} years'
      }
    };
    function formatDistance(token, count, options) {
      options = options || {};
      var result;

      if (typeof formatDistanceLocale[token] === 'string') {
        result = formatDistanceLocale[token];
      } else if (count === 1) {
        result = formatDistanceLocale[token].one;
      } else {
        result = formatDistanceLocale[token].other.replace('{{count}}', count);
      }

      if (options.addSuffix) {
        if (options.comparison > 0) {
          return 'in ' + result;
        } else {
          return result + ' ago';
        }
      }

      return result;
    }

    function buildFormatLongFn(args) {
      return function (dirtyOptions) {
        var options = dirtyOptions || {};
        var width = options.width ? String(options.width) : args.defaultWidth;
        var format = args.formats[width] || args.formats[args.defaultWidth];
        return format;
      };
    }

    var dateFormats = {
      full: 'EEEE, MMMM do, y',
      long: 'MMMM do, y',
      medium: 'MMM d, y',
      short: 'MM/dd/yyyy'
    };
    var timeFormats = {
      full: 'h:mm:ss a zzzz',
      long: 'h:mm:ss a z',
      medium: 'h:mm:ss a',
      short: 'h:mm a'
    };
    var dateTimeFormats = {
      full: "{{date}} 'at' {{time}}",
      long: "{{date}} 'at' {{time}}",
      medium: '{{date}}, {{time}}',
      short: '{{date}}, {{time}}'
    };
    var formatLong = {
      date: buildFormatLongFn({
        formats: dateFormats,
        defaultWidth: 'full'
      }),
      time: buildFormatLongFn({
        formats: timeFormats,
        defaultWidth: 'full'
      }),
      dateTime: buildFormatLongFn({
        formats: dateTimeFormats,
        defaultWidth: 'full'
      })
    };

    var formatRelativeLocale = {
      lastWeek: "'last' eeee 'at' p",
      yesterday: "'yesterday at' p",
      today: "'today at' p",
      tomorrow: "'tomorrow at' p",
      nextWeek: "eeee 'at' p",
      other: 'P'
    };
    function formatRelative$1(token, _date, _baseDate, _options) {
      return formatRelativeLocale[token];
    }

    function buildLocalizeFn(args) {
      return function (dirtyIndex, dirtyOptions) {
        var options = dirtyOptions || {};
        var context = options.context ? String(options.context) : 'standalone';
        var valuesArray;

        if (context === 'formatting' && args.formattingValues) {
          var defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
          var width = options.width ? String(options.width) : defaultWidth;
          valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
        } else {
          var _defaultWidth = args.defaultWidth;

          var _width = options.width ? String(options.width) : args.defaultWidth;

          valuesArray = args.values[_width] || args.values[_defaultWidth];
        }

        var index = args.argumentCallback ? args.argumentCallback(dirtyIndex) : dirtyIndex;
        return valuesArray[index];
      };
    }

    var eraValues = {
      narrow: ['B', 'A'],
      abbreviated: ['BC', 'AD'],
      wide: ['Before Christ', 'Anno Domini']
    };
    var quarterValues = {
      narrow: ['1', '2', '3', '4'],
      abbreviated: ['Q1', 'Q2', 'Q3', 'Q4'],
      wide: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'] // Note: in English, the names of days of the week and months are capitalized.
      // If you are making a new locale based on this one, check if the same is true for the language you're working on.
      // Generally, formatted dates should look like they are in the middle of a sentence,
      // e.g. in Spanish language the weekdays and months should be in the lowercase.

    };
    var monthValues = {
      narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      wide: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    };
    var dayValues = {
      narrow: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      short: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      abbreviated: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      wide: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    };
    var dayPeriodValues = {
      narrow: {
        am: 'a',
        pm: 'p',
        midnight: 'mi',
        noon: 'n',
        morning: 'morning',
        afternoon: 'afternoon',
        evening: 'evening',
        night: 'night'
      },
      abbreviated: {
        am: 'AM',
        pm: 'PM',
        midnight: 'midnight',
        noon: 'noon',
        morning: 'morning',
        afternoon: 'afternoon',
        evening: 'evening',
        night: 'night'
      },
      wide: {
        am: 'a.m.',
        pm: 'p.m.',
        midnight: 'midnight',
        noon: 'noon',
        morning: 'morning',
        afternoon: 'afternoon',
        evening: 'evening',
        night: 'night'
      }
    };
    var formattingDayPeriodValues = {
      narrow: {
        am: 'a',
        pm: 'p',
        midnight: 'mi',
        noon: 'n',
        morning: 'in the morning',
        afternoon: 'in the afternoon',
        evening: 'in the evening',
        night: 'at night'
      },
      abbreviated: {
        am: 'AM',
        pm: 'PM',
        midnight: 'midnight',
        noon: 'noon',
        morning: 'in the morning',
        afternoon: 'in the afternoon',
        evening: 'in the evening',
        night: 'at night'
      },
      wide: {
        am: 'a.m.',
        pm: 'p.m.',
        midnight: 'midnight',
        noon: 'noon',
        morning: 'in the morning',
        afternoon: 'in the afternoon',
        evening: 'in the evening',
        night: 'at night'
      }
    };

    function ordinalNumber(dirtyNumber, _dirtyOptions) {
      var number = Number(dirtyNumber); // If ordinal numbers depend on context, for example,
      // if they are different for different grammatical genders,
      // use `options.unit`:
      //
      //   var options = dirtyOptions || {}
      //   var unit = String(options.unit)
      //
      // where `unit` can be 'year', 'quarter', 'month', 'week', 'date', 'dayOfYear',
      // 'day', 'hour', 'minute', 'second'

      var rem100 = number % 100;

      if (rem100 > 20 || rem100 < 10) {
        switch (rem100 % 10) {
          case 1:
            return number + 'st';

          case 2:
            return number + 'nd';

          case 3:
            return number + 'rd';
        }
      }

      return number + 'th';
    }

    var localize = {
      ordinalNumber: ordinalNumber,
      era: buildLocalizeFn({
        values: eraValues,
        defaultWidth: 'wide'
      }),
      quarter: buildLocalizeFn({
        values: quarterValues,
        defaultWidth: 'wide',
        argumentCallback: function (quarter) {
          return Number(quarter) - 1;
        }
      }),
      month: buildLocalizeFn({
        values: monthValues,
        defaultWidth: 'wide'
      }),
      day: buildLocalizeFn({
        values: dayValues,
        defaultWidth: 'wide'
      }),
      dayPeriod: buildLocalizeFn({
        values: dayPeriodValues,
        defaultWidth: 'wide',
        formattingValues: formattingDayPeriodValues,
        defaultFormattingWidth: 'wide'
      })
    };

    function buildMatchPatternFn(args) {
      return function (dirtyString, dirtyOptions) {
        var string = String(dirtyString);
        var options = dirtyOptions || {};
        var matchResult = string.match(args.matchPattern);

        if (!matchResult) {
          return null;
        }

        var matchedString = matchResult[0];
        var parseResult = string.match(args.parsePattern);

        if (!parseResult) {
          return null;
        }

        var value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
        value = options.valueCallback ? options.valueCallback(value) : value;
        return {
          value: value,
          rest: string.slice(matchedString.length)
        };
      };
    }

    function buildMatchFn(args) {
      return function (dirtyString, dirtyOptions) {
        var string = String(dirtyString);
        var options = dirtyOptions || {};
        var width = options.width;
        var matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
        var matchResult = string.match(matchPattern);

        if (!matchResult) {
          return null;
        }

        var matchedString = matchResult[0];
        var parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
        var value;

        if (Object.prototype.toString.call(parsePatterns) === '[object Array]') {
          value = findIndex(parsePatterns, function (pattern) {
            return pattern.test(matchedString);
          });
        } else {
          value = findKey(parsePatterns, function (pattern) {
            return pattern.test(matchedString);
          });
        }

        value = args.valueCallback ? args.valueCallback(value) : value;
        value = options.valueCallback ? options.valueCallback(value) : value;
        return {
          value: value,
          rest: string.slice(matchedString.length)
        };
      };
    }

    function findKey(object, predicate) {
      for (var key in object) {
        if (object.hasOwnProperty(key) && predicate(object[key])) {
          return key;
        }
      }
    }

    function findIndex(array, predicate) {
      for (var key = 0; key < array.length; key++) {
        if (predicate(array[key])) {
          return key;
        }
      }
    }

    var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
    var parseOrdinalNumberPattern = /\d+/i;
    var matchEraPatterns = {
      narrow: /^(b|a)/i,
      abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
      wide: /^(before christ|before common era|anno domini|common era)/i
    };
    var parseEraPatterns = {
      any: [/^b/i, /^(a|c)/i]
    };
    var matchQuarterPatterns = {
      narrow: /^[1234]/i,
      abbreviated: /^q[1234]/i,
      wide: /^[1234](th|st|nd|rd)? quarter/i
    };
    var parseQuarterPatterns = {
      any: [/1/i, /2/i, /3/i, /4/i]
    };
    var matchMonthPatterns = {
      narrow: /^[jfmasond]/i,
      abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
      wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
    };
    var parseMonthPatterns = {
      narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
      any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
    };
    var matchDayPatterns = {
      narrow: /^[smtwf]/i,
      short: /^(su|mo|tu|we|th|fr|sa)/i,
      abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
      wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
    };
    var parseDayPatterns = {
      narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
      any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
    };
    var matchDayPeriodPatterns = {
      narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
      any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
    };
    var parseDayPeriodPatterns = {
      any: {
        am: /^a/i,
        pm: /^p/i,
        midnight: /^mi/i,
        noon: /^no/i,
        morning: /morning/i,
        afternoon: /afternoon/i,
        evening: /evening/i,
        night: /night/i
      }
    };
    var match = {
      ordinalNumber: buildMatchPatternFn({
        matchPattern: matchOrdinalNumberPattern,
        parsePattern: parseOrdinalNumberPattern,
        valueCallback: function (value) {
          return parseInt(value, 10);
        }
      }),
      era: buildMatchFn({
        matchPatterns: matchEraPatterns,
        defaultMatchWidth: 'wide',
        parsePatterns: parseEraPatterns,
        defaultParseWidth: 'any'
      }),
      quarter: buildMatchFn({
        matchPatterns: matchQuarterPatterns,
        defaultMatchWidth: 'wide',
        parsePatterns: parseQuarterPatterns,
        defaultParseWidth: 'any',
        valueCallback: function (index) {
          return index + 1;
        }
      }),
      month: buildMatchFn({
        matchPatterns: matchMonthPatterns,
        defaultMatchWidth: 'wide',
        parsePatterns: parseMonthPatterns,
        defaultParseWidth: 'any'
      }),
      day: buildMatchFn({
        matchPatterns: matchDayPatterns,
        defaultMatchWidth: 'wide',
        parsePatterns: parseDayPatterns,
        defaultParseWidth: 'any'
      }),
      dayPeriod: buildMatchFn({
        matchPatterns: matchDayPeriodPatterns,
        defaultMatchWidth: 'any',
        parsePatterns: parseDayPeriodPatterns,
        defaultParseWidth: 'any'
      })
    };

    /**
     * @type {Locale}
     * @category Locales
     * @summary English locale (United States).
     * @language English
     * @iso-639-2 eng
     * @author Sasha Koss [@kossnocorp]{@link https://github.com/kossnocorp}
     * @author Lesha Koss [@leshakoss]{@link https://github.com/leshakoss}
     */

    var locale = {
      code: 'en-US',
      formatDistance: formatDistance,
      formatLong: formatLong,
      formatRelative: formatRelative$1,
      localize: localize,
      match: match,
      options: {
        weekStartsOn: 0
        /* Sunday */
        ,
        firstWeekContainsDate: 1
      }
    };

    /**
     * @name subMilliseconds
     * @category Millisecond Helpers
     * @summary Subtract the specified number of milliseconds from the given date.
     *
     * @description
     * Subtract the specified number of milliseconds from the given date.
     *
     * ### v2.0.0 breaking changes:
     *
     * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
     *
     * @param {Date|Number} date - the date to be changed
     * @param {Number} amount - the amount of milliseconds to be subtracted. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
     * @returns {Date} the new date with the milliseconds subtracted
     * @throws {TypeError} 2 arguments required
     *
     * @example
     * // Subtract 750 milliseconds from 10 July 2014 12:45:30.000:
     * var result = subMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
     * //=> Thu Jul 10 2014 12:45:29.250
     */

    function subMilliseconds(dirtyDate, dirtyAmount) {
      requiredArgs(2, arguments);
      var amount = toInteger(dirtyAmount);
      return addMilliseconds(dirtyDate, -amount);
    }

    function addLeadingZeros(number, targetLength) {
      var sign = number < 0 ? '-' : '';
      var output = Math.abs(number).toString();

      while (output.length < targetLength) {
        output = '0' + output;
      }

      return sign + output;
    }

    /*
     * |     | Unit                           |     | Unit                           |
     * |-----|--------------------------------|-----|--------------------------------|
     * |  a  | AM, PM                         |  A* |                                |
     * |  d  | Day of month                   |  D  |                                |
     * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
     * |  m  | Minute                         |  M  | Month                          |
     * |  s  | Second                         |  S  | Fraction of second             |
     * |  y  | Year (abs)                     |  Y  |                                |
     *
     * Letters marked by * are not implemented but reserved by Unicode standard.
     */

    var formatters$1 = {
      // Year
      y: function (date, token) {
        // From http://www.unicode.org/reports/tr35/tr35-31/tr35-dates.html#Date_Format_tokens
        // | Year     |     y | yy |   yyy |  yyyy | yyyyy |
        // |----------|-------|----|-------|-------|-------|
        // | AD 1     |     1 | 01 |   001 |  0001 | 00001 |
        // | AD 12    |    12 | 12 |   012 |  0012 | 00012 |
        // | AD 123   |   123 | 23 |   123 |  0123 | 00123 |
        // | AD 1234  |  1234 | 34 |  1234 |  1234 | 01234 |
        // | AD 12345 | 12345 | 45 | 12345 | 12345 | 12345 |
        var signedYear = date.getUTCFullYear(); // Returns 1 for 1 BC (which is year 0 in JavaScript)

        var year = signedYear > 0 ? signedYear : 1 - signedYear;
        return addLeadingZeros(token === 'yy' ? year % 100 : year, token.length);
      },
      // Month
      M: function (date, token) {
        var month = date.getUTCMonth();
        return token === 'M' ? String(month + 1) : addLeadingZeros(month + 1, 2);
      },
      // Day of the month
      d: function (date, token) {
        return addLeadingZeros(date.getUTCDate(), token.length);
      },
      // AM or PM
      a: function (date, token) {
        var dayPeriodEnumValue = date.getUTCHours() / 12 >= 1 ? 'pm' : 'am';

        switch (token) {
          case 'a':
          case 'aa':
          case 'aaa':
            return dayPeriodEnumValue.toUpperCase();

          case 'aaaaa':
            return dayPeriodEnumValue[0];

          case 'aaaa':
          default:
            return dayPeriodEnumValue === 'am' ? 'a.m.' : 'p.m.';
        }
      },
      // Hour [1-12]
      h: function (date, token) {
        return addLeadingZeros(date.getUTCHours() % 12 || 12, token.length);
      },
      // Hour [0-23]
      H: function (date, token) {
        return addLeadingZeros(date.getUTCHours(), token.length);
      },
      // Minute
      m: function (date, token) {
        return addLeadingZeros(date.getUTCMinutes(), token.length);
      },
      // Second
      s: function (date, token) {
        return addLeadingZeros(date.getUTCSeconds(), token.length);
      },
      // Fraction of second
      S: function (date, token) {
        var numberOfDigits = token.length;
        var milliseconds = date.getUTCMilliseconds();
        var fractionalSeconds = Math.floor(milliseconds * Math.pow(10, numberOfDigits - 3));
        return addLeadingZeros(fractionalSeconds, token.length);
      }
    };

    var MILLISECONDS_IN_DAY = 86400000; // This function will be a part of public API when UTC function will be implemented.
    // See issue: https://github.com/date-fns/date-fns/issues/376

    function getUTCDayOfYear(dirtyDate) {
      requiredArgs(1, arguments);
      var date = toDate(dirtyDate);
      var timestamp = date.getTime();
      date.setUTCMonth(0, 1);
      date.setUTCHours(0, 0, 0, 0);
      var startOfYearTimestamp = date.getTime();
      var difference = timestamp - startOfYearTimestamp;
      return Math.floor(difference / MILLISECONDS_IN_DAY) + 1;
    }

    // See issue: https://github.com/date-fns/date-fns/issues/376

    function startOfUTCISOWeek(dirtyDate) {
      requiredArgs(1, arguments);
      var weekStartsOn = 1;
      var date = toDate(dirtyDate);
      var day = date.getUTCDay();
      var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
      date.setUTCDate(date.getUTCDate() - diff);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }

    // See issue: https://github.com/date-fns/date-fns/issues/376

    function getUTCISOWeekYear(dirtyDate) {
      requiredArgs(1, arguments);
      var date = toDate(dirtyDate);
      var year = date.getUTCFullYear();
      var fourthOfJanuaryOfNextYear = new Date(0);
      fourthOfJanuaryOfNextYear.setUTCFullYear(year + 1, 0, 4);
      fourthOfJanuaryOfNextYear.setUTCHours(0, 0, 0, 0);
      var startOfNextYear = startOfUTCISOWeek(fourthOfJanuaryOfNextYear);
      var fourthOfJanuaryOfThisYear = new Date(0);
      fourthOfJanuaryOfThisYear.setUTCFullYear(year, 0, 4);
      fourthOfJanuaryOfThisYear.setUTCHours(0, 0, 0, 0);
      var startOfThisYear = startOfUTCISOWeek(fourthOfJanuaryOfThisYear);

      if (date.getTime() >= startOfNextYear.getTime()) {
        return year + 1;
      } else if (date.getTime() >= startOfThisYear.getTime()) {
        return year;
      } else {
        return year - 1;
      }
    }

    // See issue: https://github.com/date-fns/date-fns/issues/376

    function startOfUTCISOWeekYear(dirtyDate) {
      requiredArgs(1, arguments);
      var year = getUTCISOWeekYear(dirtyDate);
      var fourthOfJanuary = new Date(0);
      fourthOfJanuary.setUTCFullYear(year, 0, 4);
      fourthOfJanuary.setUTCHours(0, 0, 0, 0);
      var date = startOfUTCISOWeek(fourthOfJanuary);
      return date;
    }

    var MILLISECONDS_IN_WEEK$1 = 604800000; // This function will be a part of public API when UTC function will be implemented.
    // See issue: https://github.com/date-fns/date-fns/issues/376

    function getUTCISOWeek(dirtyDate) {
      requiredArgs(1, arguments);
      var date = toDate(dirtyDate);
      var diff = startOfUTCISOWeek(date).getTime() - startOfUTCISOWeekYear(date).getTime(); // Round the number of days to the nearest integer
      // because the number of milliseconds in a week is not constant
      // (e.g. it's different in the week of the daylight saving time clock shift)

      return Math.round(diff / MILLISECONDS_IN_WEEK$1) + 1;
    }

    // See issue: https://github.com/date-fns/date-fns/issues/376

    function startOfUTCWeek(dirtyDate, dirtyOptions) {
      requiredArgs(1, arguments);
      var options = dirtyOptions || {};
      var locale = options.locale;
      var localeWeekStartsOn = locale && locale.options && locale.options.weekStartsOn;
      var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
      var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn); // Test if weekStartsOn is between 0 and 6 _and_ is not NaN

      if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
        throw new RangeError('weekStartsOn must be between 0 and 6 inclusively');
      }

      var date = toDate(dirtyDate);
      var day = date.getUTCDay();
      var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
      date.setUTCDate(date.getUTCDate() - diff);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }

    // See issue: https://github.com/date-fns/date-fns/issues/376

    function getUTCWeekYear(dirtyDate, dirtyOptions) {
      requiredArgs(1, arguments);
      var date = toDate(dirtyDate, dirtyOptions);
      var year = date.getUTCFullYear();
      var options = dirtyOptions || {};
      var locale = options.locale;
      var localeFirstWeekContainsDate = locale && locale.options && locale.options.firstWeekContainsDate;
      var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger(localeFirstWeekContainsDate);
      var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger(options.firstWeekContainsDate); // Test if weekStartsOn is between 1 and 7 _and_ is not NaN

      if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
        throw new RangeError('firstWeekContainsDate must be between 1 and 7 inclusively');
      }

      var firstWeekOfNextYear = new Date(0);
      firstWeekOfNextYear.setUTCFullYear(year + 1, 0, firstWeekContainsDate);
      firstWeekOfNextYear.setUTCHours(0, 0, 0, 0);
      var startOfNextYear = startOfUTCWeek(firstWeekOfNextYear, dirtyOptions);
      var firstWeekOfThisYear = new Date(0);
      firstWeekOfThisYear.setUTCFullYear(year, 0, firstWeekContainsDate);
      firstWeekOfThisYear.setUTCHours(0, 0, 0, 0);
      var startOfThisYear = startOfUTCWeek(firstWeekOfThisYear, dirtyOptions);

      if (date.getTime() >= startOfNextYear.getTime()) {
        return year + 1;
      } else if (date.getTime() >= startOfThisYear.getTime()) {
        return year;
      } else {
        return year - 1;
      }
    }

    // See issue: https://github.com/date-fns/date-fns/issues/376

    function startOfUTCWeekYear(dirtyDate, dirtyOptions) {
      requiredArgs(1, arguments);
      var options = dirtyOptions || {};
      var locale = options.locale;
      var localeFirstWeekContainsDate = locale && locale.options && locale.options.firstWeekContainsDate;
      var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger(localeFirstWeekContainsDate);
      var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger(options.firstWeekContainsDate);
      var year = getUTCWeekYear(dirtyDate, dirtyOptions);
      var firstWeek = new Date(0);
      firstWeek.setUTCFullYear(year, 0, firstWeekContainsDate);
      firstWeek.setUTCHours(0, 0, 0, 0);
      var date = startOfUTCWeek(firstWeek, dirtyOptions);
      return date;
    }

    var MILLISECONDS_IN_WEEK = 604800000; // This function will be a part of public API when UTC function will be implemented.
    // See issue: https://github.com/date-fns/date-fns/issues/376

    function getUTCWeek(dirtyDate, options) {
      requiredArgs(1, arguments);
      var date = toDate(dirtyDate);
      var diff = startOfUTCWeek(date, options).getTime() - startOfUTCWeekYear(date, options).getTime(); // Round the number of days to the nearest integer
      // because the number of milliseconds in a week is not constant
      // (e.g. it's different in the week of the daylight saving time clock shift)

      return Math.round(diff / MILLISECONDS_IN_WEEK) + 1;
    }

    var dayPeriodEnum = {
      am: 'am',
      pm: 'pm',
      midnight: 'midnight',
      noon: 'noon',
      morning: 'morning',
      afternoon: 'afternoon',
      evening: 'evening',
      night: 'night'
      /*
       * |     | Unit                           |     | Unit                           |
       * |-----|--------------------------------|-----|--------------------------------|
       * |  a  | AM, PM                         |  A* | Milliseconds in day            |
       * |  b  | AM, PM, noon, midnight         |  B  | Flexible day period            |
       * |  c  | Stand-alone local day of week  |  C* | Localized hour w/ day period   |
       * |  d  | Day of month                   |  D  | Day of year                    |
       * |  e  | Local day of week              |  E  | Day of week                    |
       * |  f  |                                |  F* | Day of week in month           |
       * |  g* | Modified Julian day            |  G  | Era                            |
       * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
       * |  i! | ISO day of week                |  I! | ISO week of year               |
       * |  j* | Localized hour w/ day period   |  J* | Localized hour w/o day period  |
       * |  k  | Hour [1-24]                    |  K  | Hour [0-11]                    |
       * |  l* | (deprecated)                   |  L  | Stand-alone month              |
       * |  m  | Minute                         |  M  | Month                          |
       * |  n  |                                |  N  |                                |
       * |  o! | Ordinal number modifier        |  O  | Timezone (GMT)                 |
       * |  p! | Long localized time            |  P! | Long localized date            |
       * |  q  | Stand-alone quarter            |  Q  | Quarter                        |
       * |  r* | Related Gregorian year         |  R! | ISO week-numbering year        |
       * |  s  | Second                         |  S  | Fraction of second             |
       * |  t! | Seconds timestamp              |  T! | Milliseconds timestamp         |
       * |  u  | Extended year                  |  U* | Cyclic year                    |
       * |  v* | Timezone (generic non-locat.)  |  V* | Timezone (location)            |
       * |  w  | Local week of year             |  W* | Week of month                  |
       * |  x  | Timezone (ISO-8601 w/o Z)      |  X  | Timezone (ISO-8601)            |
       * |  y  | Year (abs)                     |  Y  | Local week-numbering year      |
       * |  z  | Timezone (specific non-locat.) |  Z* | Timezone (aliases)             |
       *
       * Letters marked by * are not implemented but reserved by Unicode standard.
       *
       * Letters marked by ! are non-standard, but implemented by date-fns:
       * - `o` modifies the previous token to turn it into an ordinal (see `format` docs)
       * - `i` is ISO day of week. For `i` and `ii` is returns numeric ISO week days,
       *   i.e. 7 for Sunday, 1 for Monday, etc.
       * - `I` is ISO week of year, as opposed to `w` which is local week of year.
       * - `R` is ISO week-numbering year, as opposed to `Y` which is local week-numbering year.
       *   `R` is supposed to be used in conjunction with `I` and `i`
       *   for universal ISO week-numbering date, whereas
       *   `Y` is supposed to be used in conjunction with `w` and `e`
       *   for week-numbering date specific to the locale.
       * - `P` is long localized date format
       * - `p` is long localized time format
       */

    };
    var formatters = {
      // Era
      G: function (date, token, localize) {
        var era = date.getUTCFullYear() > 0 ? 1 : 0;

        switch (token) {
          // AD, BC
          case 'G':
          case 'GG':
          case 'GGG':
            return localize.era(era, {
              width: 'abbreviated'
            });
          // A, B

          case 'GGGGG':
            return localize.era(era, {
              width: 'narrow'
            });
          // Anno Domini, Before Christ

          case 'GGGG':
          default:
            return localize.era(era, {
              width: 'wide'
            });
        }
      },
      // Year
      y: function (date, token, localize) {
        // Ordinal number
        if (token === 'yo') {
          var signedYear = date.getUTCFullYear(); // Returns 1 for 1 BC (which is year 0 in JavaScript)

          var year = signedYear > 0 ? signedYear : 1 - signedYear;
          return localize.ordinalNumber(year, {
            unit: 'year'
          });
        }

        return formatters$1.y(date, token);
      },
      // Local week-numbering year
      Y: function (date, token, localize, options) {
        var signedWeekYear = getUTCWeekYear(date, options); // Returns 1 for 1 BC (which is year 0 in JavaScript)

        var weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear; // Two digit year

        if (token === 'YY') {
          var twoDigitYear = weekYear % 100;
          return addLeadingZeros(twoDigitYear, 2);
        } // Ordinal number


        if (token === 'Yo') {
          return localize.ordinalNumber(weekYear, {
            unit: 'year'
          });
        } // Padding


        return addLeadingZeros(weekYear, token.length);
      },
      // ISO week-numbering year
      R: function (date, token) {
        var isoWeekYear = getUTCISOWeekYear(date); // Padding

        return addLeadingZeros(isoWeekYear, token.length);
      },
      // Extended year. This is a single number designating the year of this calendar system.
      // The main difference between `y` and `u` localizers are B.C. years:
      // | Year | `y` | `u` |
      // |------|-----|-----|
      // | AC 1 |   1 |   1 |
      // | BC 1 |   1 |   0 |
      // | BC 2 |   2 |  -1 |
      // Also `yy` always returns the last two digits of a year,
      // while `uu` pads single digit years to 2 characters and returns other years unchanged.
      u: function (date, token) {
        var year = date.getUTCFullYear();
        return addLeadingZeros(year, token.length);
      },
      // Quarter
      Q: function (date, token, localize) {
        var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);

        switch (token) {
          // 1, 2, 3, 4
          case 'Q':
            return String(quarter);
          // 01, 02, 03, 04

          case 'QQ':
            return addLeadingZeros(quarter, 2);
          // 1st, 2nd, 3rd, 4th

          case 'Qo':
            return localize.ordinalNumber(quarter, {
              unit: 'quarter'
            });
          // Q1, Q2, Q3, Q4

          case 'QQQ':
            return localize.quarter(quarter, {
              width: 'abbreviated',
              context: 'formatting'
            });
          // 1, 2, 3, 4 (narrow quarter; could be not numerical)

          case 'QQQQQ':
            return localize.quarter(quarter, {
              width: 'narrow',
              context: 'formatting'
            });
          // 1st quarter, 2nd quarter, ...

          case 'QQQQ':
          default:
            return localize.quarter(quarter, {
              width: 'wide',
              context: 'formatting'
            });
        }
      },
      // Stand-alone quarter
      q: function (date, token, localize) {
        var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);

        switch (token) {
          // 1, 2, 3, 4
          case 'q':
            return String(quarter);
          // 01, 02, 03, 04

          case 'qq':
            return addLeadingZeros(quarter, 2);
          // 1st, 2nd, 3rd, 4th

          case 'qo':
            return localize.ordinalNumber(quarter, {
              unit: 'quarter'
            });
          // Q1, Q2, Q3, Q4

          case 'qqq':
            return localize.quarter(quarter, {
              width: 'abbreviated',
              context: 'standalone'
            });
          // 1, 2, 3, 4 (narrow quarter; could be not numerical)

          case 'qqqqq':
            return localize.quarter(quarter, {
              width: 'narrow',
              context: 'standalone'
            });
          // 1st quarter, 2nd quarter, ...

          case 'qqqq':
          default:
            return localize.quarter(quarter, {
              width: 'wide',
              context: 'standalone'
            });
        }
      },
      // Month
      M: function (date, token, localize) {
        var month = date.getUTCMonth();

        switch (token) {
          case 'M':
          case 'MM':
            return formatters$1.M(date, token);
          // 1st, 2nd, ..., 12th

          case 'Mo':
            return localize.ordinalNumber(month + 1, {
              unit: 'month'
            });
          // Jan, Feb, ..., Dec

          case 'MMM':
            return localize.month(month, {
              width: 'abbreviated',
              context: 'formatting'
            });
          // J, F, ..., D

          case 'MMMMM':
            return localize.month(month, {
              width: 'narrow',
              context: 'formatting'
            });
          // January, February, ..., December

          case 'MMMM':
          default:
            return localize.month(month, {
              width: 'wide',
              context: 'formatting'
            });
        }
      },
      // Stand-alone month
      L: function (date, token, localize) {
        var month = date.getUTCMonth();

        switch (token) {
          // 1, 2, ..., 12
          case 'L':
            return String(month + 1);
          // 01, 02, ..., 12

          case 'LL':
            return addLeadingZeros(month + 1, 2);
          // 1st, 2nd, ..., 12th

          case 'Lo':
            return localize.ordinalNumber(month + 1, {
              unit: 'month'
            });
          // Jan, Feb, ..., Dec

          case 'LLL':
            return localize.month(month, {
              width: 'abbreviated',
              context: 'standalone'
            });
          // J, F, ..., D

          case 'LLLLL':
            return localize.month(month, {
              width: 'narrow',
              context: 'standalone'
            });
          // January, February, ..., December

          case 'LLLL':
          default:
            return localize.month(month, {
              width: 'wide',
              context: 'standalone'
            });
        }
      },
      // Local week of year
      w: function (date, token, localize, options) {
        var week = getUTCWeek(date, options);

        if (token === 'wo') {
          return localize.ordinalNumber(week, {
            unit: 'week'
          });
        }

        return addLeadingZeros(week, token.length);
      },
      // ISO week of year
      I: function (date, token, localize) {
        var isoWeek = getUTCISOWeek(date);

        if (token === 'Io') {
          return localize.ordinalNumber(isoWeek, {
            unit: 'week'
          });
        }

        return addLeadingZeros(isoWeek, token.length);
      },
      // Day of the month
      d: function (date, token, localize) {
        if (token === 'do') {
          return localize.ordinalNumber(date.getUTCDate(), {
            unit: 'date'
          });
        }

        return formatters$1.d(date, token);
      },
      // Day of year
      D: function (date, token, localize) {
        var dayOfYear = getUTCDayOfYear(date);

        if (token === 'Do') {
          return localize.ordinalNumber(dayOfYear, {
            unit: 'dayOfYear'
          });
        }

        return addLeadingZeros(dayOfYear, token.length);
      },
      // Day of week
      E: function (date, token, localize) {
        var dayOfWeek = date.getUTCDay();

        switch (token) {
          // Tue
          case 'E':
          case 'EE':
          case 'EEE':
            return localize.day(dayOfWeek, {
              width: 'abbreviated',
              context: 'formatting'
            });
          // T

          case 'EEEEE':
            return localize.day(dayOfWeek, {
              width: 'narrow',
              context: 'formatting'
            });
          // Tu

          case 'EEEEEE':
            return localize.day(dayOfWeek, {
              width: 'short',
              context: 'formatting'
            });
          // Tuesday

          case 'EEEE':
          default:
            return localize.day(dayOfWeek, {
              width: 'wide',
              context: 'formatting'
            });
        }
      },
      // Local day of week
      e: function (date, token, localize, options) {
        var dayOfWeek = date.getUTCDay();
        var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;

        switch (token) {
          // Numerical value (Nth day of week with current locale or weekStartsOn)
          case 'e':
            return String(localDayOfWeek);
          // Padded numerical value

          case 'ee':
            return addLeadingZeros(localDayOfWeek, 2);
          // 1st, 2nd, ..., 7th

          case 'eo':
            return localize.ordinalNumber(localDayOfWeek, {
              unit: 'day'
            });

          case 'eee':
            return localize.day(dayOfWeek, {
              width: 'abbreviated',
              context: 'formatting'
            });
          // T

          case 'eeeee':
            return localize.day(dayOfWeek, {
              width: 'narrow',
              context: 'formatting'
            });
          // Tu

          case 'eeeeee':
            return localize.day(dayOfWeek, {
              width: 'short',
              context: 'formatting'
            });
          // Tuesday

          case 'eeee':
          default:
            return localize.day(dayOfWeek, {
              width: 'wide',
              context: 'formatting'
            });
        }
      },
      // Stand-alone local day of week
      c: function (date, token, localize, options) {
        var dayOfWeek = date.getUTCDay();
        var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;

        switch (token) {
          // Numerical value (same as in `e`)
          case 'c':
            return String(localDayOfWeek);
          // Padded numerical value

          case 'cc':
            return addLeadingZeros(localDayOfWeek, token.length);
          // 1st, 2nd, ..., 7th

          case 'co':
            return localize.ordinalNumber(localDayOfWeek, {
              unit: 'day'
            });

          case 'ccc':
            return localize.day(dayOfWeek, {
              width: 'abbreviated',
              context: 'standalone'
            });
          // T

          case 'ccccc':
            return localize.day(dayOfWeek, {
              width: 'narrow',
              context: 'standalone'
            });
          // Tu

          case 'cccccc':
            return localize.day(dayOfWeek, {
              width: 'short',
              context: 'standalone'
            });
          // Tuesday

          case 'cccc':
          default:
            return localize.day(dayOfWeek, {
              width: 'wide',
              context: 'standalone'
            });
        }
      },
      // ISO day of week
      i: function (date, token, localize) {
        var dayOfWeek = date.getUTCDay();
        var isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

        switch (token) {
          // 2
          case 'i':
            return String(isoDayOfWeek);
          // 02

          case 'ii':
            return addLeadingZeros(isoDayOfWeek, token.length);
          // 2nd

          case 'io':
            return localize.ordinalNumber(isoDayOfWeek, {
              unit: 'day'
            });
          // Tue

          case 'iii':
            return localize.day(dayOfWeek, {
              width: 'abbreviated',
              context: 'formatting'
            });
          // T

          case 'iiiii':
            return localize.day(dayOfWeek, {
              width: 'narrow',
              context: 'formatting'
            });
          // Tu

          case 'iiiiii':
            return localize.day(dayOfWeek, {
              width: 'short',
              context: 'formatting'
            });
          // Tuesday

          case 'iiii':
          default:
            return localize.day(dayOfWeek, {
              width: 'wide',
              context: 'formatting'
            });
        }
      },
      // AM or PM
      a: function (date, token, localize) {
        var hours = date.getUTCHours();
        var dayPeriodEnumValue = hours / 12 >= 1 ? 'pm' : 'am';

        switch (token) {
          case 'a':
          case 'aa':
          case 'aaa':
            return localize.dayPeriod(dayPeriodEnumValue, {
              width: 'abbreviated',
              context: 'formatting'
            });

          case 'aaaaa':
            return localize.dayPeriod(dayPeriodEnumValue, {
              width: 'narrow',
              context: 'formatting'
            });

          case 'aaaa':
          default:
            return localize.dayPeriod(dayPeriodEnumValue, {
              width: 'wide',
              context: 'formatting'
            });
        }
      },
      // AM, PM, midnight, noon
      b: function (date, token, localize) {
        var hours = date.getUTCHours();
        var dayPeriodEnumValue;

        if (hours === 12) {
          dayPeriodEnumValue = dayPeriodEnum.noon;
        } else if (hours === 0) {
          dayPeriodEnumValue = dayPeriodEnum.midnight;
        } else {
          dayPeriodEnumValue = hours / 12 >= 1 ? 'pm' : 'am';
        }

        switch (token) {
          case 'b':
          case 'bb':
          case 'bbb':
            return localize.dayPeriod(dayPeriodEnumValue, {
              width: 'abbreviated',
              context: 'formatting'
            });

          case 'bbbbb':
            return localize.dayPeriod(dayPeriodEnumValue, {
              width: 'narrow',
              context: 'formatting'
            });

          case 'bbbb':
          default:
            return localize.dayPeriod(dayPeriodEnumValue, {
              width: 'wide',
              context: 'formatting'
            });
        }
      },
      // in the morning, in the afternoon, in the evening, at night
      B: function (date, token, localize) {
        var hours = date.getUTCHours();
        var dayPeriodEnumValue;

        if (hours >= 17) {
          dayPeriodEnumValue = dayPeriodEnum.evening;
        } else if (hours >= 12) {
          dayPeriodEnumValue = dayPeriodEnum.afternoon;
        } else if (hours >= 4) {
          dayPeriodEnumValue = dayPeriodEnum.morning;
        } else {
          dayPeriodEnumValue = dayPeriodEnum.night;
        }

        switch (token) {
          case 'B':
          case 'BB':
          case 'BBB':
            return localize.dayPeriod(dayPeriodEnumValue, {
              width: 'abbreviated',
              context: 'formatting'
            });

          case 'BBBBB':
            return localize.dayPeriod(dayPeriodEnumValue, {
              width: 'narrow',
              context: 'formatting'
            });

          case 'BBBB':
          default:
            return localize.dayPeriod(dayPeriodEnumValue, {
              width: 'wide',
              context: 'formatting'
            });
        }
      },
      // Hour [1-12]
      h: function (date, token, localize) {
        if (token === 'ho') {
          var hours = date.getUTCHours() % 12;
          if (hours === 0) hours = 12;
          return localize.ordinalNumber(hours, {
            unit: 'hour'
          });
        }

        return formatters$1.h(date, token);
      },
      // Hour [0-23]
      H: function (date, token, localize) {
        if (token === 'Ho') {
          return localize.ordinalNumber(date.getUTCHours(), {
            unit: 'hour'
          });
        }

        return formatters$1.H(date, token);
      },
      // Hour [0-11]
      K: function (date, token, localize) {
        var hours = date.getUTCHours() % 12;

        if (token === 'Ko') {
          return localize.ordinalNumber(hours, {
            unit: 'hour'
          });
        }

        return addLeadingZeros(hours, token.length);
      },
      // Hour [1-24]
      k: function (date, token, localize) {
        var hours = date.getUTCHours();
        if (hours === 0) hours = 24;

        if (token === 'ko') {
          return localize.ordinalNumber(hours, {
            unit: 'hour'
          });
        }

        return addLeadingZeros(hours, token.length);
      },
      // Minute
      m: function (date, token, localize) {
        if (token === 'mo') {
          return localize.ordinalNumber(date.getUTCMinutes(), {
            unit: 'minute'
          });
        }

        return formatters$1.m(date, token);
      },
      // Second
      s: function (date, token, localize) {
        if (token === 'so') {
          return localize.ordinalNumber(date.getUTCSeconds(), {
            unit: 'second'
          });
        }

        return formatters$1.s(date, token);
      },
      // Fraction of second
      S: function (date, token) {
        return formatters$1.S(date, token);
      },
      // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
      X: function (date, token, _localize, options) {
        var originalDate = options._originalDate || date;
        var timezoneOffset = originalDate.getTimezoneOffset();

        if (timezoneOffset === 0) {
          return 'Z';
        }

        switch (token) {
          // Hours and optional minutes
          case 'X':
            return formatTimezoneWithOptionalMinutes(timezoneOffset);
          // Hours, minutes and optional seconds without `:` delimiter
          // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
          // so this token always has the same output as `XX`

          case 'XXXX':
          case 'XX':
            // Hours and minutes without `:` delimiter
            return formatTimezone(timezoneOffset);
          // Hours, minutes and optional seconds with `:` delimiter
          // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
          // so this token always has the same output as `XXX`

          case 'XXXXX':
          case 'XXX': // Hours and minutes with `:` delimiter

          default:
            return formatTimezone(timezoneOffset, ':');
        }
      },
      // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
      x: function (date, token, _localize, options) {
        var originalDate = options._originalDate || date;
        var timezoneOffset = originalDate.getTimezoneOffset();

        switch (token) {
          // Hours and optional minutes
          case 'x':
            return formatTimezoneWithOptionalMinutes(timezoneOffset);
          // Hours, minutes and optional seconds without `:` delimiter
          // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
          // so this token always has the same output as `xx`

          case 'xxxx':
          case 'xx':
            // Hours and minutes without `:` delimiter
            return formatTimezone(timezoneOffset);
          // Hours, minutes and optional seconds with `:` delimiter
          // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
          // so this token always has the same output as `xxx`

          case 'xxxxx':
          case 'xxx': // Hours and minutes with `:` delimiter

          default:
            return formatTimezone(timezoneOffset, ':');
        }
      },
      // Timezone (GMT)
      O: function (date, token, _localize, options) {
        var originalDate = options._originalDate || date;
        var timezoneOffset = originalDate.getTimezoneOffset();

        switch (token) {
          // Short
          case 'O':
          case 'OO':
          case 'OOO':
            return 'GMT' + formatTimezoneShort(timezoneOffset, ':');
          // Long

          case 'OOOO':
          default:
            return 'GMT' + formatTimezone(timezoneOffset, ':');
        }
      },
      // Timezone (specific non-location)
      z: function (date, token, _localize, options) {
        var originalDate = options._originalDate || date;
        var timezoneOffset = originalDate.getTimezoneOffset();

        switch (token) {
          // Short
          case 'z':
          case 'zz':
          case 'zzz':
            return 'GMT' + formatTimezoneShort(timezoneOffset, ':');
          // Long

          case 'zzzz':
          default:
            return 'GMT' + formatTimezone(timezoneOffset, ':');
        }
      },
      // Seconds timestamp
      t: function (date, token, _localize, options) {
        var originalDate = options._originalDate || date;
        var timestamp = Math.floor(originalDate.getTime() / 1000);
        return addLeadingZeros(timestamp, token.length);
      },
      // Milliseconds timestamp
      T: function (date, token, _localize, options) {
        var originalDate = options._originalDate || date;
        var timestamp = originalDate.getTime();
        return addLeadingZeros(timestamp, token.length);
      }
    };

    function formatTimezoneShort(offset, dirtyDelimiter) {
      var sign = offset > 0 ? '-' : '+';
      var absOffset = Math.abs(offset);
      var hours = Math.floor(absOffset / 60);
      var minutes = absOffset % 60;

      if (minutes === 0) {
        return sign + String(hours);
      }

      var delimiter = dirtyDelimiter || '';
      return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
    }

    function formatTimezoneWithOptionalMinutes(offset, dirtyDelimiter) {
      if (offset % 60 === 0) {
        var sign = offset > 0 ? '-' : '+';
        return sign + addLeadingZeros(Math.abs(offset) / 60, 2);
      }

      return formatTimezone(offset, dirtyDelimiter);
    }

    function formatTimezone(offset, dirtyDelimiter) {
      var delimiter = dirtyDelimiter || '';
      var sign = offset > 0 ? '-' : '+';
      var absOffset = Math.abs(offset);
      var hours = addLeadingZeros(Math.floor(absOffset / 60), 2);
      var minutes = addLeadingZeros(absOffset % 60, 2);
      return sign + hours + delimiter + minutes;
    }

    function dateLongFormatter(pattern, formatLong) {
      switch (pattern) {
        case 'P':
          return formatLong.date({
            width: 'short'
          });

        case 'PP':
          return formatLong.date({
            width: 'medium'
          });

        case 'PPP':
          return formatLong.date({
            width: 'long'
          });

        case 'PPPP':
        default:
          return formatLong.date({
            width: 'full'
          });
      }
    }

    function timeLongFormatter(pattern, formatLong) {
      switch (pattern) {
        case 'p':
          return formatLong.time({
            width: 'short'
          });

        case 'pp':
          return formatLong.time({
            width: 'medium'
          });

        case 'ppp':
          return formatLong.time({
            width: 'long'
          });

        case 'pppp':
        default:
          return formatLong.time({
            width: 'full'
          });
      }
    }

    function dateTimeLongFormatter(pattern, formatLong) {
      var matchResult = pattern.match(/(P+)(p+)?/);
      var datePattern = matchResult[1];
      var timePattern = matchResult[2];

      if (!timePattern) {
        return dateLongFormatter(pattern, formatLong);
      }

      var dateTimeFormat;

      switch (datePattern) {
        case 'P':
          dateTimeFormat = formatLong.dateTime({
            width: 'short'
          });
          break;

        case 'PP':
          dateTimeFormat = formatLong.dateTime({
            width: 'medium'
          });
          break;

        case 'PPP':
          dateTimeFormat = formatLong.dateTime({
            width: 'long'
          });
          break;

        case 'PPPP':
        default:
          dateTimeFormat = formatLong.dateTime({
            width: 'full'
          });
          break;
      }

      return dateTimeFormat.replace('{{date}}', dateLongFormatter(datePattern, formatLong)).replace('{{time}}', timeLongFormatter(timePattern, formatLong));
    }

    var longFormatters = {
      p: timeLongFormatter,
      P: dateTimeLongFormatter
    };

    var protectedDayOfYearTokens = ['D', 'DD'];
    var protectedWeekYearTokens = ['YY', 'YYYY'];
    function isProtectedDayOfYearToken(token) {
      return protectedDayOfYearTokens.indexOf(token) !== -1;
    }
    function isProtectedWeekYearToken(token) {
      return protectedWeekYearTokens.indexOf(token) !== -1;
    }
    function throwProtectedError(token, format, input) {
      if (token === 'YYYY') {
        throw new RangeError("Use `yyyy` instead of `YYYY` (in `".concat(format, "`) for formatting years to the input `").concat(input, "`; see: https://git.io/fxCyr"));
      } else if (token === 'YY') {
        throw new RangeError("Use `yy` instead of `YY` (in `".concat(format, "`) for formatting years to the input `").concat(input, "`; see: https://git.io/fxCyr"));
      } else if (token === 'D') {
        throw new RangeError("Use `d` instead of `D` (in `".concat(format, "`) for formatting days of the month to the input `").concat(input, "`; see: https://git.io/fxCyr"));
      } else if (token === 'DD') {
        throw new RangeError("Use `dd` instead of `DD` (in `".concat(format, "`) for formatting days of the month to the input `").concat(input, "`; see: https://git.io/fxCyr"));
      }
    }

    // - [yYQqMLwIdDecihHKkms]o matches any available ordinal number token
    //   (one of the certain letters followed by `o`)
    // - (\w)\1* matches any sequences of the same letter
    // - '' matches two quote characters in a row
    // - '(''|[^'])+('|$) matches anything surrounded by two quote characters ('),
    //   except a single quote symbol, which ends the sequence.
    //   Two quote characters do not end the sequence.
    //   If there is no matching single quote
    //   then the sequence will continue until the end of the string.
    // - . matches any single character unmatched by previous parts of the RegExps

    var formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g; // This RegExp catches symbols escaped by quotes, and also
    // sequences of symbols P, p, and the combinations like `PPPPPPPppppp`

    var longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
    var escapedStringRegExp = /^'([^]*?)'?$/;
    var doubleQuoteRegExp = /''/g;
    var unescapedLatinCharacterRegExp = /[a-zA-Z]/;
    /**
     * @name format
     * @category Common Helpers
     * @summary Format the date.
     *
     * @description
     * Return the formatted date string in the given format. The result may vary by locale.
     *
     * > ⚠️ Please note that the `format` tokens differ from Moment.js and other libraries.
     * > See: https://git.io/fxCyr
     *
     * The characters wrapped between two single quotes characters (') are escaped.
     * Two single quotes in a row, whether inside or outside a quoted sequence, represent a 'real' single quote.
     * (see the last example)
     *
     * Format of the string is based on Unicode Technical Standard #35:
     * https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
     * with a few additions (see note 7 below the table).
     *
     * Accepted patterns:
     * | Unit                            | Pattern | Result examples                   | Notes |
     * |---------------------------------|---------|-----------------------------------|-------|
     * | Era                             | G..GGG  | AD, BC                            |       |
     * |                                 | GGGG    | Anno Domini, Before Christ        | 2     |
     * |                                 | GGGGG   | A, B                              |       |
     * | Calendar year                   | y       | 44, 1, 1900, 2017                 | 5     |
     * |                                 | yo      | 44th, 1st, 0th, 17th              | 5,7   |
     * |                                 | yy      | 44, 01, 00, 17                    | 5     |
     * |                                 | yyy     | 044, 001, 1900, 2017              | 5     |
     * |                                 | yyyy    | 0044, 0001, 1900, 2017            | 5     |
     * |                                 | yyyyy   | ...                               | 3,5   |
     * | Local week-numbering year       | Y       | 44, 1, 1900, 2017                 | 5     |
     * |                                 | Yo      | 44th, 1st, 1900th, 2017th         | 5,7   |
     * |                                 | YY      | 44, 01, 00, 17                    | 5,8   |
     * |                                 | YYY     | 044, 001, 1900, 2017              | 5     |
     * |                                 | YYYY    | 0044, 0001, 1900, 2017            | 5,8   |
     * |                                 | YYYYY   | ...                               | 3,5   |
     * | ISO week-numbering year         | R       | -43, 0, 1, 1900, 2017             | 5,7   |
     * |                                 | RR      | -43, 00, 01, 1900, 2017           | 5,7   |
     * |                                 | RRR     | -043, 000, 001, 1900, 2017        | 5,7   |
     * |                                 | RRRR    | -0043, 0000, 0001, 1900, 2017     | 5,7   |
     * |                                 | RRRRR   | ...                               | 3,5,7 |
     * | Extended year                   | u       | -43, 0, 1, 1900, 2017             | 5     |
     * |                                 | uu      | -43, 01, 1900, 2017               | 5     |
     * |                                 | uuu     | -043, 001, 1900, 2017             | 5     |
     * |                                 | uuuu    | -0043, 0001, 1900, 2017           | 5     |
     * |                                 | uuuuu   | ...                               | 3,5   |
     * | Quarter (formatting)            | Q       | 1, 2, 3, 4                        |       |
     * |                                 | Qo      | 1st, 2nd, 3rd, 4th                | 7     |
     * |                                 | QQ      | 01, 02, 03, 04                    |       |
     * |                                 | QQQ     | Q1, Q2, Q3, Q4                    |       |
     * |                                 | QQQQ    | 1st quarter, 2nd quarter, ...     | 2     |
     * |                                 | QQQQQ   | 1, 2, 3, 4                        | 4     |
     * | Quarter (stand-alone)           | q       | 1, 2, 3, 4                        |       |
     * |                                 | qo      | 1st, 2nd, 3rd, 4th                | 7     |
     * |                                 | qq      | 01, 02, 03, 04                    |       |
     * |                                 | qqq     | Q1, Q2, Q3, Q4                    |       |
     * |                                 | qqqq    | 1st quarter, 2nd quarter, ...     | 2     |
     * |                                 | qqqqq   | 1, 2, 3, 4                        | 4     |
     * | Month (formatting)              | M       | 1, 2, ..., 12                     |       |
     * |                                 | Mo      | 1st, 2nd, ..., 12th               | 7     |
     * |                                 | MM      | 01, 02, ..., 12                   |       |
     * |                                 | MMM     | Jan, Feb, ..., Dec                |       |
     * |                                 | MMMM    | January, February, ..., December  | 2     |
     * |                                 | MMMMM   | J, F, ..., D                      |       |
     * | Month (stand-alone)             | L       | 1, 2, ..., 12                     |       |
     * |                                 | Lo      | 1st, 2nd, ..., 12th               | 7     |
     * |                                 | LL      | 01, 02, ..., 12                   |       |
     * |                                 | LLL     | Jan, Feb, ..., Dec                |       |
     * |                                 | LLLL    | January, February, ..., December  | 2     |
     * |                                 | LLLLL   | J, F, ..., D                      |       |
     * | Local week of year              | w       | 1, 2, ..., 53                     |       |
     * |                                 | wo      | 1st, 2nd, ..., 53th               | 7     |
     * |                                 | ww      | 01, 02, ..., 53                   |       |
     * | ISO week of year                | I       | 1, 2, ..., 53                     | 7     |
     * |                                 | Io      | 1st, 2nd, ..., 53th               | 7     |
     * |                                 | II      | 01, 02, ..., 53                   | 7     |
     * | Day of month                    | d       | 1, 2, ..., 31                     |       |
     * |                                 | do      | 1st, 2nd, ..., 31st               | 7     |
     * |                                 | dd      | 01, 02, ..., 31                   |       |
     * | Day of year                     | D       | 1, 2, ..., 365, 366               | 9     |
     * |                                 | Do      | 1st, 2nd, ..., 365th, 366th       | 7     |
     * |                                 | DD      | 01, 02, ..., 365, 366             | 9     |
     * |                                 | DDD     | 001, 002, ..., 365, 366           |       |
     * |                                 | DDDD    | ...                               | 3     |
     * | Day of week (formatting)        | E..EEE  | Mon, Tue, Wed, ..., Sun           |       |
     * |                                 | EEEE    | Monday, Tuesday, ..., Sunday      | 2     |
     * |                                 | EEEEE   | M, T, W, T, F, S, S               |       |
     * |                                 | EEEEEE  | Mo, Tu, We, Th, Fr, Su, Sa        |       |
     * | ISO day of week (formatting)    | i       | 1, 2, 3, ..., 7                   | 7     |
     * |                                 | io      | 1st, 2nd, ..., 7th                | 7     |
     * |                                 | ii      | 01, 02, ..., 07                   | 7     |
     * |                                 | iii     | Mon, Tue, Wed, ..., Sun           | 7     |
     * |                                 | iiii    | Monday, Tuesday, ..., Sunday      | 2,7   |
     * |                                 | iiiii   | M, T, W, T, F, S, S               | 7     |
     * |                                 | iiiiii  | Mo, Tu, We, Th, Fr, Su, Sa        | 7     |
     * | Local day of week (formatting)  | e       | 2, 3, 4, ..., 1                   |       |
     * |                                 | eo      | 2nd, 3rd, ..., 1st                | 7     |
     * |                                 | ee      | 02, 03, ..., 01                   |       |
     * |                                 | eee     | Mon, Tue, Wed, ..., Sun           |       |
     * |                                 | eeee    | Monday, Tuesday, ..., Sunday      | 2     |
     * |                                 | eeeee   | M, T, W, T, F, S, S               |       |
     * |                                 | eeeeee  | Mo, Tu, We, Th, Fr, Su, Sa        |       |
     * | Local day of week (stand-alone) | c       | 2, 3, 4, ..., 1                   |       |
     * |                                 | co      | 2nd, 3rd, ..., 1st                | 7     |
     * |                                 | cc      | 02, 03, ..., 01                   |       |
     * |                                 | ccc     | Mon, Tue, Wed, ..., Sun           |       |
     * |                                 | cccc    | Monday, Tuesday, ..., Sunday      | 2     |
     * |                                 | ccccc   | M, T, W, T, F, S, S               |       |
     * |                                 | cccccc  | Mo, Tu, We, Th, Fr, Su, Sa        |       |
     * | AM, PM                          | a..aaa  | AM, PM                            |       |
     * |                                 | aaaa    | a.m., p.m.                        | 2     |
     * |                                 | aaaaa   | a, p                              |       |
     * | AM, PM, noon, midnight          | b..bbb  | AM, PM, noon, midnight            |       |
     * |                                 | bbbb    | a.m., p.m., noon, midnight        | 2     |
     * |                                 | bbbbb   | a, p, n, mi                       |       |
     * | Flexible day period             | B..BBB  | at night, in the morning, ...     |       |
     * |                                 | BBBB    | at night, in the morning, ...     | 2     |
     * |                                 | BBBBB   | at night, in the morning, ...     |       |
     * | Hour [1-12]                     | h       | 1, 2, ..., 11, 12                 |       |
     * |                                 | ho      | 1st, 2nd, ..., 11th, 12th         | 7     |
     * |                                 | hh      | 01, 02, ..., 11, 12               |       |
     * | Hour [0-23]                     | H       | 0, 1, 2, ..., 23                  |       |
     * |                                 | Ho      | 0th, 1st, 2nd, ..., 23rd          | 7     |
     * |                                 | HH      | 00, 01, 02, ..., 23               |       |
     * | Hour [0-11]                     | K       | 1, 2, ..., 11, 0                  |       |
     * |                                 | Ko      | 1st, 2nd, ..., 11th, 0th          | 7     |
     * |                                 | KK      | 01, 02, ..., 11, 00               |       |
     * | Hour [1-24]                     | k       | 24, 1, 2, ..., 23                 |       |
     * |                                 | ko      | 24th, 1st, 2nd, ..., 23rd         | 7     |
     * |                                 | kk      | 24, 01, 02, ..., 23               |       |
     * | Minute                          | m       | 0, 1, ..., 59                     |       |
     * |                                 | mo      | 0th, 1st, ..., 59th               | 7     |
     * |                                 | mm      | 00, 01, ..., 59                   |       |
     * | Second                          | s       | 0, 1, ..., 59                     |       |
     * |                                 | so      | 0th, 1st, ..., 59th               | 7     |
     * |                                 | ss      | 00, 01, ..., 59                   |       |
     * | Fraction of second              | S       | 0, 1, ..., 9                      |       |
     * |                                 | SS      | 00, 01, ..., 99                   |       |
     * |                                 | SSS     | 000, 0001, ..., 999               |       |
     * |                                 | SSSS    | ...                               | 3     |
     * | Timezone (ISO-8601 w/ Z)        | X       | -08, +0530, Z                     |       |
     * |                                 | XX      | -0800, +0530, Z                   |       |
     * |                                 | XXX     | -08:00, +05:30, Z                 |       |
     * |                                 | XXXX    | -0800, +0530, Z, +123456          | 2     |
     * |                                 | XXXXX   | -08:00, +05:30, Z, +12:34:56      |       |
     * | Timezone (ISO-8601 w/o Z)       | x       | -08, +0530, +00                   |       |
     * |                                 | xx      | -0800, +0530, +0000               |       |
     * |                                 | xxx     | -08:00, +05:30, +00:00            | 2     |
     * |                                 | xxxx    | -0800, +0530, +0000, +123456      |       |
     * |                                 | xxxxx   | -08:00, +05:30, +00:00, +12:34:56 |       |
     * | Timezone (GMT)                  | O...OOO | GMT-8, GMT+5:30, GMT+0            |       |
     * |                                 | OOOO    | GMT-08:00, GMT+05:30, GMT+00:00   | 2     |
     * | Timezone (specific non-locat.)  | z...zzz | GMT-8, GMT+5:30, GMT+0            | 6     |
     * |                                 | zzzz    | GMT-08:00, GMT+05:30, GMT+00:00   | 2,6   |
     * | Seconds timestamp               | t       | 512969520                         | 7     |
     * |                                 | tt      | ...                               | 3,7   |
     * | Milliseconds timestamp          | T       | 512969520900                      | 7     |
     * |                                 | TT      | ...                               | 3,7   |
     * | Long localized date             | P       | 05/29/1453                        | 7     |
     * |                                 | PP      | May 29, 1453                      | 7     |
     * |                                 | PPP     | May 29th, 1453                    | 7     |
     * |                                 | PPPP    | Sunday, May 29th, 1453            | 2,7   |
     * | Long localized time             | p       | 12:00 AM                          | 7     |
     * |                                 | pp      | 12:00:00 AM                       | 7     |
     * |                                 | ppp     | 12:00:00 AM GMT+2                 | 7     |
     * |                                 | pppp    | 12:00:00 AM GMT+02:00             | 2,7   |
     * | Combination of date and time    | Pp      | 05/29/1453, 12:00 AM              | 7     |
     * |                                 | PPpp    | May 29, 1453, 12:00:00 AM         | 7     |
     * |                                 | PPPppp  | May 29th, 1453 at ...             | 7     |
     * |                                 | PPPPpppp| Sunday, May 29th, 1453 at ...     | 2,7   |
     * Notes:
     * 1. "Formatting" units (e.g. formatting quarter) in the default en-US locale
     *    are the same as "stand-alone" units, but are different in some languages.
     *    "Formatting" units are declined according to the rules of the language
     *    in the context of a date. "Stand-alone" units are always nominative singular:
     *
     *    `format(new Date(2017, 10, 6), 'do LLLL', {locale: cs}) //=> '6. listopad'`
     *
     *    `format(new Date(2017, 10, 6), 'do MMMM', {locale: cs}) //=> '6. listopadu'`
     *
     * 2. Any sequence of the identical letters is a pattern, unless it is escaped by
     *    the single quote characters (see below).
     *    If the sequence is longer than listed in table (e.g. `EEEEEEEEEEE`)
     *    the output will be the same as default pattern for this unit, usually
     *    the longest one (in case of ISO weekdays, `EEEE`). Default patterns for units
     *    are marked with "2" in the last column of the table.
     *
     *    `format(new Date(2017, 10, 6), 'MMM') //=> 'Nov'`
     *
     *    `format(new Date(2017, 10, 6), 'MMMM') //=> 'November'`
     *
     *    `format(new Date(2017, 10, 6), 'MMMMM') //=> 'N'`
     *
     *    `format(new Date(2017, 10, 6), 'MMMMMM') //=> 'November'`
     *
     *    `format(new Date(2017, 10, 6), 'MMMMMMM') //=> 'November'`
     *
     * 3. Some patterns could be unlimited length (such as `yyyyyyyy`).
     *    The output will be padded with zeros to match the length of the pattern.
     *
     *    `format(new Date(2017, 10, 6), 'yyyyyyyy') //=> '00002017'`
     *
     * 4. `QQQQQ` and `qqqqq` could be not strictly numerical in some locales.
     *    These tokens represent the shortest form of the quarter.
     *
     * 5. The main difference between `y` and `u` patterns are B.C. years:
     *
     *    | Year | `y` | `u` |
     *    |------|-----|-----|
     *    | AC 1 |   1 |   1 |
     *    | BC 1 |   1 |   0 |
     *    | BC 2 |   2 |  -1 |
     *
     *    Also `yy` always returns the last two digits of a year,
     *    while `uu` pads single digit years to 2 characters and returns other years unchanged:
     *
     *    | Year | `yy` | `uu` |
     *    |------|------|------|
     *    | 1    |   01 |   01 |
     *    | 14   |   14 |   14 |
     *    | 376  |   76 |  376 |
     *    | 1453 |   53 | 1453 |
     *
     *    The same difference is true for local and ISO week-numbering years (`Y` and `R`),
     *    except local week-numbering years are dependent on `options.weekStartsOn`
     *    and `options.firstWeekContainsDate` (compare [getISOWeekYear]{@link https://date-fns.org/docs/getISOWeekYear}
     *    and [getWeekYear]{@link https://date-fns.org/docs/getWeekYear}).
     *
     * 6. Specific non-location timezones are currently unavailable in `date-fns`,
     *    so right now these tokens fall back to GMT timezones.
     *
     * 7. These patterns are not in the Unicode Technical Standard #35:
     *    - `i`: ISO day of week
     *    - `I`: ISO week of year
     *    - `R`: ISO week-numbering year
     *    - `t`: seconds timestamp
     *    - `T`: milliseconds timestamp
     *    - `o`: ordinal number modifier
     *    - `P`: long localized date
     *    - `p`: long localized time
     *
     * 8. `YY` and `YYYY` tokens represent week-numbering years but they are often confused with years.
     *    You should enable `options.useAdditionalWeekYearTokens` to use them. See: https://git.io/fxCyr
     *
     * 9. `D` and `DD` tokens represent days of the year but they are ofthen confused with days of the month.
     *    You should enable `options.useAdditionalDayOfYearTokens` to use them. See: https://git.io/fxCyr
     *
     * ### v2.0.0 breaking changes:
     *
     * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
     *
     * - The second argument is now required for the sake of explicitness.
     *
     *   ```javascript
     *   // Before v2.0.0
     *   format(new Date(2016, 0, 1))
     *
     *   // v2.0.0 onward
     *   format(new Date(2016, 0, 1), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
     *   ```
     *
     * - New format string API for `format` function
     *   which is based on [Unicode Technical Standard #35](https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table).
     *   See [this post](https://blog.date-fns.org/post/unicode-tokens-in-date-fns-v2-sreatyki91jg) for more details.
     *
     * - Characters are now escaped using single quote symbols (`'`) instead of square brackets.
     *
     * @param {Date|Number} date - the original date
     * @param {String} format - the string of tokens
     * @param {Object} [options] - an object with options.
     * @param {Locale} [options.locale=defaultLocale] - the locale object. See [Locale]{@link https://date-fns.org/docs/Locale}
     * @param {0|1|2|3|4|5|6} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
     * @param {Number} [options.firstWeekContainsDate=1] - the day of January, which is
     * @param {Boolean} [options.useAdditionalWeekYearTokens=false] - if true, allows usage of the week-numbering year tokens `YY` and `YYYY`;
     *   see: https://git.io/fxCyr
     * @param {Boolean} [options.useAdditionalDayOfYearTokens=false] - if true, allows usage of the day of year tokens `D` and `DD`;
     *   see: https://git.io/fxCyr
     * @returns {String} the formatted date string
     * @throws {TypeError} 2 arguments required
     * @throws {RangeError} `date` must not be Invalid Date
     * @throws {RangeError} `options.locale` must contain `localize` property
     * @throws {RangeError} `options.locale` must contain `formatLong` property
     * @throws {RangeError} `options.weekStartsOn` must be between 0 and 6
     * @throws {RangeError} `options.firstWeekContainsDate` must be between 1 and 7
     * @throws {RangeError} use `yyyy` instead of `YYYY` for formatting years using [format provided] to the input [input provided]; see: https://git.io/fxCyr
     * @throws {RangeError} use `yy` instead of `YY` for formatting years using [format provided] to the input [input provided]; see: https://git.io/fxCyr
     * @throws {RangeError} use `d` instead of `D` for formatting days of the month using [format provided] to the input [input provided]; see: https://git.io/fxCyr
     * @throws {RangeError} use `dd` instead of `DD` for formatting days of the month using [format provided] to the input [input provided]; see: https://git.io/fxCyr
     * @throws {RangeError} format string contains an unescaped latin alphabet character
     *
     * @example
     * // Represent 11 February 2014 in middle-endian format:
     * var result = format(new Date(2014, 1, 11), 'MM/dd/yyyy')
     * //=> '02/11/2014'
     *
     * @example
     * // Represent 2 July 2014 in Esperanto:
     * import { eoLocale } from 'date-fns/locale/eo'
     * var result = format(new Date(2014, 6, 2), "do 'de' MMMM yyyy", {
     *   locale: eoLocale
     * })
     * //=> '2-a de julio 2014'
     *
     * @example
     * // Escape string by single quote characters:
     * var result = format(new Date(2014, 6, 2, 15), "h 'o''clock'")
     * //=> "3 o'clock"
     */

    function format(dirtyDate, dirtyFormatStr, dirtyOptions) {
      requiredArgs(2, arguments);
      var formatStr = String(dirtyFormatStr);
      var options = dirtyOptions || {};
      var locale$1 = options.locale || locale;
      var localeFirstWeekContainsDate = locale$1.options && locale$1.options.firstWeekContainsDate;
      var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger(localeFirstWeekContainsDate);
      var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger(options.firstWeekContainsDate); // Test if weekStartsOn is between 1 and 7 _and_ is not NaN

      if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
        throw new RangeError('firstWeekContainsDate must be between 1 and 7 inclusively');
      }

      var localeWeekStartsOn = locale$1.options && locale$1.options.weekStartsOn;
      var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
      var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn); // Test if weekStartsOn is between 0 and 6 _and_ is not NaN

      if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
        throw new RangeError('weekStartsOn must be between 0 and 6 inclusively');
      }

      if (!locale$1.localize) {
        throw new RangeError('locale must contain localize property');
      }

      if (!locale$1.formatLong) {
        throw new RangeError('locale must contain formatLong property');
      }

      var originalDate = toDate(dirtyDate);

      if (!isValid(originalDate)) {
        throw new RangeError('Invalid time value');
      } // Convert the date in system timezone to the same date in UTC+00:00 timezone.
      // This ensures that when UTC functions will be implemented, locales will be compatible with them.
      // See an issue about UTC functions: https://github.com/date-fns/date-fns/issues/376


      var timezoneOffset = getTimezoneOffsetInMilliseconds(originalDate);
      var utcDate = subMilliseconds(originalDate, timezoneOffset);
      var formatterOptions = {
        firstWeekContainsDate: firstWeekContainsDate,
        weekStartsOn: weekStartsOn,
        locale: locale$1,
        _originalDate: originalDate
      };
      var result = formatStr.match(longFormattingTokensRegExp).map(function (substring) {
        var firstCharacter = substring[0];

        if (firstCharacter === 'p' || firstCharacter === 'P') {
          var longFormatter = longFormatters[firstCharacter];
          return longFormatter(substring, locale$1.formatLong, formatterOptions);
        }

        return substring;
      }).join('').match(formattingTokensRegExp).map(function (substring) {
        // Replace two single quote characters with one single quote character
        if (substring === "''") {
          return "'";
        }

        var firstCharacter = substring[0];

        if (firstCharacter === "'") {
          return cleanEscapedString(substring);
        }

        var formatter = formatters[firstCharacter];

        if (formatter) {
          if (!options.useAdditionalWeekYearTokens && isProtectedWeekYearToken(substring)) {
            throwProtectedError(substring, dirtyFormatStr, dirtyDate);
          }

          if (!options.useAdditionalDayOfYearTokens && isProtectedDayOfYearToken(substring)) {
            throwProtectedError(substring, dirtyFormatStr, dirtyDate);
          }

          return formatter(utcDate, substring, locale$1.localize, formatterOptions);
        }

        if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
          throw new RangeError('Format string contains an unescaped latin alphabet character `' + firstCharacter + '`');
        }

        return substring;
      }).join('');
      return result;
    }

    function cleanEscapedString(input) {
      return input.match(escapedStringRegExp)[1].replace(doubleQuoteRegExp, "'");
    }

    /**
     * @name formatRelative
     * @category Common Helpers
     * @summary Represent the date in words relative to the given base date.
     *
     * @description
     * Represent the date in words relative to the given base date.
     *
     * | Distance to the base date | Result                    |
     * |---------------------------|---------------------------|
     * | Previous 6 days           | last Sunday at 04:30 AM   |
     * | Last day                  | yesterday at 04:30 AM     |
     * | Same day                  | today at 04:30 AM         |
     * | Next day                  | tomorrow at 04:30 AM      |
     * | Next 6 days               | Sunday at 04:30 AM        |
     * | Other                     | 12/31/2017                |
     *
     * ### v2.0.0 breaking changes:
     *
     * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
     *
     * @param {Date|Number} date - the date to format
     * @param {Date|Number} baseDate - the date to compare with
     * @param {Object} [options] - an object with options.
     * @param {Locale} [options.locale=defaultLocale] - the locale object. See [Locale]{@link https://date-fns.org/docs/Locale}
     * @param {0|1|2|3|4|5|6} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
     * @returns {String} the date in words
     * @throws {TypeError} 2 arguments required
     * @throws {RangeError} `date` must not be Invalid Date
     * @throws {RangeError} `baseDate` must not be Invalid Date
     * @throws {RangeError} `options.weekStartsOn` must be between 0 and 6
     * @throws {RangeError} `options.locale` must contain `localize` property
     * @throws {RangeError} `options.locale` must contain `formatLong` property
     * @throws {RangeError} `options.locale` must contain `formatRelative` property
     */

    function formatRelative(dirtyDate, dirtyBaseDate, dirtyOptions) {
      requiredArgs(2, arguments);
      var date = toDate(dirtyDate);
      var baseDate = toDate(dirtyBaseDate);
      var options = dirtyOptions || {};
      var locale$1 = options.locale || locale;

      if (!locale$1.localize) {
        throw new RangeError('locale must contain localize property');
      }

      if (!locale$1.formatLong) {
        throw new RangeError('locale must contain formatLong property');
      }

      if (!locale$1.formatRelative) {
        throw new RangeError('locale must contain formatRelative property');
      }

      var diff = differenceInCalendarDays(date, baseDate);

      if (isNaN(diff)) {
        throw new RangeError('Invalid time value');
      }

      var token;

      if (diff < -6) {
        token = 'other';
      } else if (diff < -1) {
        token = 'lastWeek';
      } else if (diff < 0) {
        token = 'yesterday';
      } else if (diff < 1) {
        token = 'today';
      } else if (diff < 2) {
        token = 'tomorrow';
      } else if (diff < 7) {
        token = 'nextWeek';
      } else {
        token = 'other';
      }

      var utcDate = subMilliseconds(date, getTimezoneOffsetInMilliseconds(date));
      var utcBaseDate = subMilliseconds(baseDate, getTimezoneOffsetInMilliseconds(baseDate));
      var formatStr = locale$1.formatRelative(token, utcDate, utcBaseDate, options);
      return format(date, formatStr, options);
    }

    var deepFreezeEs6 = {exports: {}};

    function deepFreeze(obj) {
        if (obj instanceof Map) {
            obj.clear = obj.delete = obj.set = function () {
                throw new Error('map is read-only');
            };
        } else if (obj instanceof Set) {
            obj.add = obj.clear = obj.delete = function () {
                throw new Error('set is read-only');
            };
        }

        // Freeze self
        Object.freeze(obj);

        Object.getOwnPropertyNames(obj).forEach(function (name) {
            var prop = obj[name];

            // Freeze prop if it is an object
            if (typeof prop == 'object' && !Object.isFrozen(prop)) {
                deepFreeze(prop);
            }
        });

        return obj;
    }

    deepFreezeEs6.exports = deepFreeze;
    deepFreezeEs6.exports.default = deepFreeze;

    var deepFreeze$1 = deepFreezeEs6.exports;

    /** @typedef {import('highlight.js').CallbackResponse} CallbackResponse */
    /** @typedef {import('highlight.js').CompiledMode} CompiledMode */
    /** @implements CallbackResponse */

    class Response {
      /**
       * @param {CompiledMode} mode
       */
      constructor(mode) {
        // eslint-disable-next-line no-undefined
        if (mode.data === undefined) mode.data = {};

        this.data = mode.data;
        this.isMatchIgnored = false;
      }

      ignoreMatch() {
        this.isMatchIgnored = true;
      }
    }

    /**
     * @param {string} value
     * @returns {string}
     */
    function escapeHTML$1(value) {
      return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    }

    /**
     * performs a shallow merge of multiple objects into one
     *
     * @template T
     * @param {T} original
     * @param {Record<string,any>[]} objects
     * @returns {T} a single new object
     */
    function inherit$1(original, ...objects) {
      /** @type Record<string,any> */
      const result = Object.create(null);

      for (const key in original) {
        result[key] = original[key];
      }
      objects.forEach(function(obj) {
        for (const key in obj) {
          result[key] = obj[key];
        }
      });
      return /** @type {T} */ (result);
    }

    /**
     * @typedef {object} Renderer
     * @property {(text: string) => void} addText
     * @property {(node: Node) => void} openNode
     * @property {(node: Node) => void} closeNode
     * @property {() => string} value
     */

    /** @typedef {{kind?: string, sublanguage?: boolean}} Node */
    /** @typedef {{walk: (r: Renderer) => void}} Tree */
    /** */

    const SPAN_CLOSE = '</span>';

    /**
     * Determines if a node needs to be wrapped in <span>
     *
     * @param {Node} node */
    const emitsWrappingTags = (node) => {
      return !!node.kind;
    };

    /**
     *
     * @param {string} name
     * @param {{prefix:string}} options
     */
    const expandScopeName = (name, { prefix }) => {
      if (name.includes(".")) {
        const pieces = name.split(".");
        return [
          `${prefix}${pieces.shift()}`,
          ...(pieces.map((x, i) => `${x}${"_".repeat(i + 1)}`))
        ].join(" ");
      }
      return `${prefix}${name}`;
    };

    /** @type {Renderer} */
    class HTMLRenderer {
      /**
       * Creates a new HTMLRenderer
       *
       * @param {Tree} parseTree - the parse tree (must support `walk` API)
       * @param {{classPrefix: string}} options
       */
      constructor(parseTree, options) {
        this.buffer = "";
        this.classPrefix = options.classPrefix;
        parseTree.walk(this);
      }

      /**
       * Adds texts to the output stream
       *
       * @param {string} text */
      addText(text) {
        this.buffer += escapeHTML$1(text);
      }

      /**
       * Adds a node open to the output stream (if needed)
       *
       * @param {Node} node */
      openNode(node) {
        if (!emitsWrappingTags(node)) return;

        let scope = node.kind;
        if (node.sublanguage) {
          scope = `language-${scope}`;
        } else {
          scope = expandScopeName(scope, { prefix: this.classPrefix });
        }
        this.span(scope);
      }

      /**
       * Adds a node close to the output stream (if needed)
       *
       * @param {Node} node */
      closeNode(node) {
        if (!emitsWrappingTags(node)) return;

        this.buffer += SPAN_CLOSE;
      }

      /**
       * returns the accumulated buffer
      */
      value() {
        return this.buffer;
      }

      // helpers

      /**
       * Builds a span element
       *
       * @param {string} className */
      span(className) {
        this.buffer += `<span class="${className}">`;
      }
    }

    /** @typedef {{kind?: string, sublanguage?: boolean, children: Node[]} | string} Node */
    /** @typedef {{kind?: string, sublanguage?: boolean, children: Node[]} } DataNode */
    /** @typedef {import('highlight.js').Emitter} Emitter */
    /**  */

    class TokenTree {
      constructor() {
        /** @type DataNode */
        this.rootNode = { children: [] };
        this.stack = [this.rootNode];
      }

      get top() {
        return this.stack[this.stack.length - 1];
      }

      get root() { return this.rootNode; }

      /** @param {Node} node */
      add(node) {
        this.top.children.push(node);
      }

      /** @param {string} kind */
      openNode(kind) {
        /** @type Node */
        const node = { kind, children: [] };
        this.add(node);
        this.stack.push(node);
      }

      closeNode() {
        if (this.stack.length > 1) {
          return this.stack.pop();
        }
        // eslint-disable-next-line no-undefined
        return undefined;
      }

      closeAllNodes() {
        while (this.closeNode());
      }

      toJSON() {
        return JSON.stringify(this.rootNode, null, 4);
      }

      /**
       * @typedef { import("./html_renderer").Renderer } Renderer
       * @param {Renderer} builder
       */
      walk(builder) {
        // this does not
        return this.constructor._walk(builder, this.rootNode);
        // this works
        // return TokenTree._walk(builder, this.rootNode);
      }

      /**
       * @param {Renderer} builder
       * @param {Node} node
       */
      static _walk(builder, node) {
        if (typeof node === "string") {
          builder.addText(node);
        } else if (node.children) {
          builder.openNode(node);
          node.children.forEach((child) => this._walk(builder, child));
          builder.closeNode(node);
        }
        return builder;
      }

      /**
       * @param {Node} node
       */
      static _collapse(node) {
        if (typeof node === "string") return;
        if (!node.children) return;

        if (node.children.every(el => typeof el === "string")) {
          // node.text = node.children.join("");
          // delete node.children;
          node.children = [node.children.join("")];
        } else {
          node.children.forEach((child) => {
            TokenTree._collapse(child);
          });
        }
      }
    }

    /**
      Currently this is all private API, but this is the minimal API necessary
      that an Emitter must implement to fully support the parser.

      Minimal interface:

      - addKeyword(text, kind)
      - addText(text)
      - addSublanguage(emitter, subLanguageName)
      - finalize()
      - openNode(kind)
      - closeNode()
      - closeAllNodes()
      - toHTML()

    */

    /**
     * @implements {Emitter}
     */
    class TokenTreeEmitter extends TokenTree {
      /**
       * @param {*} options
       */
      constructor(options) {
        super();
        this.options = options;
      }

      /**
       * @param {string} text
       * @param {string} kind
       */
      addKeyword(text, kind) {
        if (text === "") { return; }

        this.openNode(kind);
        this.addText(text);
        this.closeNode();
      }

      /**
       * @param {string} text
       */
      addText(text) {
        if (text === "") { return; }

        this.add(text);
      }

      /**
       * @param {Emitter & {root: DataNode}} emitter
       * @param {string} name
       */
      addSublanguage(emitter, name) {
        /** @type DataNode */
        const node = emitter.root;
        node.kind = name;
        node.sublanguage = true;
        this.add(node);
      }

      toHTML() {
        const renderer = new HTMLRenderer(this, this.options);
        return renderer.value();
      }

      finalize() {
        return true;
      }
    }

    /**
     * @param {string} value
     * @returns {RegExp}
     * */

    /**
     * @param {RegExp | string } re
     * @returns {string}
     */
    function source(re) {
      if (!re) return null;
      if (typeof re === "string") return re;

      return re.source;
    }

    /**
     * @param {RegExp | string } re
     * @returns {string}
     */
    function lookahead(re) {
      return concat('(?=', re, ')');
    }

    /**
     * @param {...(RegExp | string) } args
     * @returns {string}
     */
    function concat(...args) {
      const joined = args.map((x) => source(x)).join("");
      return joined;
    }

    function stripOptionsFromArgs(args) {
      const opts = args[args.length - 1];

      if (typeof opts === 'object' && opts.constructor === Object) {
        args.splice(args.length - 1, 1);
        return opts;
      } else {
        return {};
      }
    }

    /**
     * Any of the passed expresssions may match
     *
     * Creates a huge this | this | that | that match
     * @param {(RegExp | string)[] } args
     * @returns {string}
     */
    function either(...args) {
      const opts = stripOptionsFromArgs(args);
      const joined = '(' +
        (opts.capture ? "" : "?:") +
        args.map((x) => source(x)).join("|") + ")";
      return joined;
    }

    /**
     * @param {RegExp} re
     * @returns {number}
     */
    function countMatchGroups(re) {
      return (new RegExp(re.toString() + '|')).exec('').length - 1;
    }

    /**
     * Does lexeme start with a regular expression match at the beginning
     * @param {RegExp} re
     * @param {string} lexeme
     */
    function startsWith(re, lexeme) {
      const match = re && re.exec(lexeme);
      return match && match.index === 0;
    }

    // BACKREF_RE matches an open parenthesis or backreference. To avoid
    // an incorrect parse, it additionally matches the following:
    // - [...] elements, where the meaning of parentheses and escapes change
    // - other escape sequences, so we do not misparse escape sequences as
    //   interesting elements
    // - non-matching or lookahead parentheses, which do not capture. These
    //   follow the '(' with a '?'.
    const BACKREF_RE = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;

    // **INTERNAL** Not intended for outside usage
    // join logically computes regexps.join(separator), but fixes the
    // backreferences so they continue to match.
    // it also places each individual regular expression into it's own
    // match group, keeping track of the sequencing of those match groups
    // is currently an exercise for the caller. :-)
    /**
     * @param {(string | RegExp)[]} regexps
     * @param {{joinWith: string}} opts
     * @returns {string}
     */
    function _rewriteBackreferences(regexps, { joinWith }) {
      let numCaptures = 0;

      return regexps.map((regex) => {
        numCaptures += 1;
        const offset = numCaptures;
        let re = source(regex);
        let out = '';

        while (re.length > 0) {
          const match = BACKREF_RE.exec(re);
          if (!match) {
            out += re;
            break;
          }
          out += re.substring(0, match.index);
          re = re.substring(match.index + match[0].length);
          if (match[0][0] === '\\' && match[1]) {
            // Adjust the backreference.
            out += '\\' + String(Number(match[1]) + offset);
          } else {
            out += match[0];
            if (match[0] === '(') {
              numCaptures++;
            }
          }
        }
        return out;
      }).map(re => `(${re})`).join(joinWith);
    }

    /** @typedef {import('highlight.js').Mode} Mode */
    /** @typedef {import('highlight.js').ModeCallback} ModeCallback */

    // Common regexps
    const MATCH_NOTHING_RE = /\b\B/;
    const IDENT_RE = '[a-zA-Z]\\w*';
    const UNDERSCORE_IDENT_RE = '[a-zA-Z_]\\w*';
    const NUMBER_RE = '\\b\\d+(\\.\\d+)?';
    const C_NUMBER_RE = '(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)'; // 0x..., 0..., decimal, float
    const BINARY_NUMBER_RE = '\\b(0b[01]+)'; // 0b...
    const RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';

    /**
    * @param { Partial<Mode> & {binary?: string | RegExp} } opts
    */
    const SHEBANG = (opts = {}) => {
      const beginShebang = /^#![ ]*\//;
      if (opts.binary) {
        opts.begin = concat(
          beginShebang,
          /.*\b/,
          opts.binary,
          /\b.*/);
      }
      return inherit$1({
        scope: 'meta',
        begin: beginShebang,
        end: /$/,
        relevance: 0,
        /** @type {ModeCallback} */
        "on:begin": (m, resp) => {
          if (m.index !== 0) resp.ignoreMatch();
        }
      }, opts);
    };

    // Common modes
    const BACKSLASH_ESCAPE = {
      begin: '\\\\[\\s\\S]', relevance: 0
    };
    const APOS_STRING_MODE = {
      scope: 'string',
      begin: '\'',
      end: '\'',
      illegal: '\\n',
      contains: [BACKSLASH_ESCAPE]
    };
    const QUOTE_STRING_MODE = {
      scope: 'string',
      begin: '"',
      end: '"',
      illegal: '\\n',
      contains: [BACKSLASH_ESCAPE]
    };
    const PHRASAL_WORDS_MODE = {
      begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
    };
    /**
     * Creates a comment mode
     *
     * @param {string | RegExp} begin
     * @param {string | RegExp} end
     * @param {Mode | {}} [modeOptions]
     * @returns {Partial<Mode>}
     */
    const COMMENT = function(begin, end, modeOptions = {}) {
      const mode = inherit$1(
        {
          scope: 'comment',
          begin,
          end,
          contains: []
        },
        modeOptions
      );
      mode.contains.push({
        scope: 'doctag',
        // hack to avoid the space from being included. the space is necessary to
        // match here to prevent the plain text rule below from gobbling up doctags
        begin: '[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)',
        end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
        excludeBegin: true,
        relevance: 0
      });
      const ENGLISH_WORD = either(
        // list of common 1 and 2 letter words in English
        "I",
        "a",
        "is",
        "so",
        "us",
        "to",
        "at",
        "if",
        "in",
        "it",
        "on",
        // note: this is not an exhaustive list of contractions, just popular ones
        /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, // contractions - can't we'd they're let's, etc
        /[A-Za-z]+[-][a-z]+/, // `no-way`, etc.
        /[A-Za-z][a-z]{2,}/ // allow capitalized words at beginning of sentences
      );
      // looking like plain text, more likely to be a comment
      mode.contains.push(
        {
          // TODO: how to include ", (, ) without breaking grammars that use these for
          // comment delimiters?
          // begin: /[ ]+([()"]?([A-Za-z'-]{3,}|is|a|I|so|us|[tT][oO]|at|if|in|it|on)[.]?[()":]?([.][ ]|[ ]|\))){3}/
          // ---

          // this tries to find sequences of 3 english words in a row (without any
          // "programming" type syntax) this gives us a strong signal that we've
          // TRULY found a comment - vs perhaps scanning with the wrong language.
          // It's possible to find something that LOOKS like the start of the
          // comment - but then if there is no readable text - good chance it is a
          // false match and not a comment.
          //
          // for a visual example please see:
          // https://github.com/highlightjs/highlight.js/issues/2827

          begin: concat(
            /[ ]+/, // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
            '(',
            ENGLISH_WORD,
            /[.]?[:]?([.][ ]|[ ])/,
            '){3}') // look for 3 words in a row
        }
      );
      return mode;
    };
    const C_LINE_COMMENT_MODE = COMMENT('//', '$');
    const C_BLOCK_COMMENT_MODE = COMMENT('/\\*', '\\*/');
    const HASH_COMMENT_MODE = COMMENT('#', '$');
    const NUMBER_MODE = {
      scope: 'number',
      begin: NUMBER_RE,
      relevance: 0
    };
    const C_NUMBER_MODE = {
      scope: 'number',
      begin: C_NUMBER_RE,
      relevance: 0
    };
    const BINARY_NUMBER_MODE = {
      scope: 'number',
      begin: BINARY_NUMBER_RE,
      relevance: 0
    };
    const REGEXP_MODE = {
      // this outer rule makes sure we actually have a WHOLE regex and not simply
      // an expression such as:
      //
      //     3 / something
      //
      // (which will then blow up when regex's `illegal` sees the newline)
      begin: /(?=\/[^/\n]*\/)/,
      contains: [{
        scope: 'regexp',
        begin: /\//,
        end: /\/[gimuy]*/,
        illegal: /\n/,
        contains: [
          BACKSLASH_ESCAPE,
          {
            begin: /\[/,
            end: /\]/,
            relevance: 0,
            contains: [BACKSLASH_ESCAPE]
          }
        ]
      }]
    };
    const TITLE_MODE = {
      scope: 'title',
      begin: IDENT_RE,
      relevance: 0
    };
    const UNDERSCORE_TITLE_MODE = {
      scope: 'title',
      begin: UNDERSCORE_IDENT_RE,
      relevance: 0
    };
    const METHOD_GUARD = {
      // excludes method names from keyword processing
      begin: '\\.\\s*' + UNDERSCORE_IDENT_RE,
      relevance: 0
    };

    /**
     * Adds end same as begin mechanics to a mode
     *
     * Your mode must include at least a single () match group as that first match
     * group is what is used for comparison
     * @param {Partial<Mode>} mode
     */
    const END_SAME_AS_BEGIN = function(mode) {
      return Object.assign(mode,
        {
          /** @type {ModeCallback} */
          'on:begin': (m, resp) => { resp.data._beginMatch = m[1]; },
          /** @type {ModeCallback} */
          'on:end': (m, resp) => { if (resp.data._beginMatch !== m[1]) resp.ignoreMatch(); }
        });
    };

    var MODES = /*#__PURE__*/Object.freeze({
        __proto__: null,
        MATCH_NOTHING_RE: MATCH_NOTHING_RE,
        IDENT_RE: IDENT_RE,
        UNDERSCORE_IDENT_RE: UNDERSCORE_IDENT_RE,
        NUMBER_RE: NUMBER_RE,
        C_NUMBER_RE: C_NUMBER_RE,
        BINARY_NUMBER_RE: BINARY_NUMBER_RE,
        RE_STARTERS_RE: RE_STARTERS_RE,
        SHEBANG: SHEBANG,
        BACKSLASH_ESCAPE: BACKSLASH_ESCAPE,
        APOS_STRING_MODE: APOS_STRING_MODE,
        QUOTE_STRING_MODE: QUOTE_STRING_MODE,
        PHRASAL_WORDS_MODE: PHRASAL_WORDS_MODE,
        COMMENT: COMMENT,
        C_LINE_COMMENT_MODE: C_LINE_COMMENT_MODE,
        C_BLOCK_COMMENT_MODE: C_BLOCK_COMMENT_MODE,
        HASH_COMMENT_MODE: HASH_COMMENT_MODE,
        NUMBER_MODE: NUMBER_MODE,
        C_NUMBER_MODE: C_NUMBER_MODE,
        BINARY_NUMBER_MODE: BINARY_NUMBER_MODE,
        REGEXP_MODE: REGEXP_MODE,
        TITLE_MODE: TITLE_MODE,
        UNDERSCORE_TITLE_MODE: UNDERSCORE_TITLE_MODE,
        METHOD_GUARD: METHOD_GUARD,
        END_SAME_AS_BEGIN: END_SAME_AS_BEGIN
    });

    /**
    @typedef {import('highlight.js').CallbackResponse} CallbackResponse
    @typedef {import('highlight.js').CompilerExt} CompilerExt
    */

    // Grammar extensions / plugins
    // See: https://github.com/highlightjs/highlight.js/issues/2833

    // Grammar extensions allow "syntactic sugar" to be added to the grammar modes
    // without requiring any underlying changes to the compiler internals.

    // `compileMatch` being the perfect small example of now allowing a grammar
    // author to write `match` when they desire to match a single expression rather
    // than being forced to use `begin`.  The extension then just moves `match` into
    // `begin` when it runs.  Ie, no features have been added, but we've just made
    // the experience of writing (and reading grammars) a little bit nicer.

    // ------

    // TODO: We need negative look-behind support to do this properly
    /**
     * Skip a match if it has a preceding dot
     *
     * This is used for `beginKeywords` to prevent matching expressions such as
     * `bob.keyword.do()`. The mode compiler automatically wires this up as a
     * special _internal_ 'on:begin' callback for modes with `beginKeywords`
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    function skipIfHasPrecedingDot(match, response) {
      const before = match.input[match.index - 1];
      if (before === ".") {
        response.ignoreMatch();
      }
    }

    /**
     *
     * @type {CompilerExt}
     */
    function scopeClassName(mode, _parent) {
      // eslint-disable-next-line no-undefined
      if (mode.className !== undefined) {
        mode.scope = mode.className;
        delete mode.className;
      }
    }

    /**
     * `beginKeywords` syntactic sugar
     * @type {CompilerExt}
     */
    function beginKeywords(mode, parent) {
      if (!parent) return;
      if (!mode.beginKeywords) return;

      // for languages with keywords that include non-word characters checking for
      // a word boundary is not sufficient, so instead we check for a word boundary
      // or whitespace - this does no harm in any case since our keyword engine
      // doesn't allow spaces in keywords anyways and we still check for the boundary
      // first
      mode.begin = '\\b(' + mode.beginKeywords.split(' ').join('|') + ')(?!\\.)(?=\\b|\\s)';
      mode.__beforeBegin = skipIfHasPrecedingDot;
      mode.keywords = mode.keywords || mode.beginKeywords;
      delete mode.beginKeywords;

      // prevents double relevance, the keywords themselves provide
      // relevance, the mode doesn't need to double it
      // eslint-disable-next-line no-undefined
      if (mode.relevance === undefined) mode.relevance = 0;
    }

    /**
     * Allow `illegal` to contain an array of illegal values
     * @type {CompilerExt}
     */
    function compileIllegal(mode, _parent) {
      if (!Array.isArray(mode.illegal)) return;

      mode.illegal = either(...mode.illegal);
    }

    /**
     * `match` to match a single expression for readability
     * @type {CompilerExt}
     */
    function compileMatch(mode, _parent) {
      if (!mode.match) return;
      if (mode.begin || mode.end) throw new Error("begin & end are not supported with match");

      mode.begin = mode.match;
      delete mode.match;
    }

    /**
     * provides the default 1 relevance to all modes
     * @type {CompilerExt}
     */
    function compileRelevance(mode, _parent) {
      // eslint-disable-next-line no-undefined
      if (mode.relevance === undefined) mode.relevance = 1;
    }

    // allow beforeMatch to act as a "qualifier" for the match
    // the full match begin must be [beforeMatch][begin]
    const beforeMatchExt = (mode, parent) => {
      if (!mode.beforeMatch) return;
      // starts conflicts with endsParent which we need to make sure the child
      // rule is not matched multiple times
      if (mode.starts) throw new Error("beforeMatch cannot be used with starts");

      const originalMode = Object.assign({}, mode);
      Object.keys(mode).forEach((key) => { delete mode[key]; });

      mode.keywords = originalMode.keywords;
      mode.begin = concat(originalMode.beforeMatch, lookahead(originalMode.begin));
      mode.starts = {
        relevance: 0,
        contains: [
          Object.assign(originalMode, { endsParent: true })
        ]
      };
      mode.relevance = 0;

      delete originalMode.beforeMatch;
    };

    // keywords that should have no default relevance value
    const COMMON_KEYWORDS = [
      'of',
      'and',
      'for',
      'in',
      'not',
      'or',
      'if',
      'then',
      'parent', // common variable name
      'list', // common variable name
      'value' // common variable name
    ];

    const DEFAULT_KEYWORD_SCOPE = "keyword";

    /**
     * Given raw keywords from a language definition, compile them.
     *
     * @param {string | Record<string,string|string[]> | Array<string>} rawKeywords
     * @param {boolean} caseInsensitive
     */
    function compileKeywords(rawKeywords, caseInsensitive, scopeName = DEFAULT_KEYWORD_SCOPE) {
      /** @type KeywordDict */
      const compiledKeywords = Object.create(null);

      // input can be a string of keywords, an array of keywords, or a object with
      // named keys representing scopeName (which can then point to a string or array)
      if (typeof rawKeywords === 'string') {
        compileList(scopeName, rawKeywords.split(" "));
      } else if (Array.isArray(rawKeywords)) {
        compileList(scopeName, rawKeywords);
      } else {
        Object.keys(rawKeywords).forEach(function(scopeName) {
          // collapse all our objects back into the parent object
          Object.assign(
            compiledKeywords,
            compileKeywords(rawKeywords[scopeName], caseInsensitive, scopeName)
          );
        });
      }
      return compiledKeywords;

      // ---

      /**
       * Compiles an individual list of keywords
       *
       * Ex: "for if when while|5"
       *
       * @param {string} scopeName
       * @param {Array<string>} keywordList
       */
      function compileList(scopeName, keywordList) {
        if (caseInsensitive) {
          keywordList = keywordList.map(x => x.toLowerCase());
        }
        keywordList.forEach(function(keyword) {
          const pair = keyword.split('|');
          compiledKeywords[pair[0]] = [scopeName, scoreForKeyword(pair[0], pair[1])];
        });
      }
    }

    /**
     * Returns the proper score for a given keyword
     *
     * Also takes into account comment keywords, which will be scored 0 UNLESS
     * another score has been manually assigned.
     * @param {string} keyword
     * @param {string} [providedScore]
     */
    function scoreForKeyword(keyword, providedScore) {
      // manual scores always win over common keywords
      // so you can force a score of 1 if you really insist
      if (providedScore) {
        return Number(providedScore);
      }

      return commonKeyword(keyword) ? 0 : 1;
    }

    /**
     * Determines if a given keyword is common or not
     *
     * @param {string} keyword */
    function commonKeyword(keyword) {
      return COMMON_KEYWORDS.includes(keyword.toLowerCase());
    }

    /*

    For the reasoning behind this please see:
    https://github.com/highlightjs/highlight.js/issues/2880#issuecomment-747275419

    */

    /**
     * @type {Record<string, boolean>}
     */
    const seenDeprecations = {};

    /**
     * @param {string} message
     */
    const error = (message) => {
      console.error(message);
    };

    /**
     * @param {string} message
     * @param {any} args
     */
    const warn = (message, ...args) => {
      console.log(`WARN: ${message}`, ...args);
    };

    /**
     * @param {string} version
     * @param {string} message
     */
    const deprecated = (version, message) => {
      if (seenDeprecations[`${version}/${message}`]) return;

      console.log(`Deprecated as of ${version}. ${message}`);
      seenDeprecations[`${version}/${message}`] = true;
    };

    /* eslint-disable no-throw-literal */

    /**
    @typedef {import('highlight.js').CompiledMode} CompiledMode
    */

    const MultiClassError = new Error();

    /**
     * Renumbers labeled scope names to account for additional inner match
     * groups that otherwise would break everything.
     *
     * Lets say we 3 match scopes:
     *
     *   { 1 => ..., 2 => ..., 3 => ... }
     *
     * So what we need is a clean match like this:
     *
     *   (a)(b)(c) => [ "a", "b", "c" ]
     *
     * But this falls apart with inner match groups:
     *
     * (a)(((b)))(c) => ["a", "b", "b", "b", "c" ]
     *
     * Our scopes are now "out of alignment" and we're repeating `b` 3 times.
     * What needs to happen is the numbers are remapped:
     *
     *   { 1 => ..., 2 => ..., 5 => ... }
     *
     * We also need to know that the ONLY groups that should be output
     * are 1, 2, and 5.  This function handles this behavior.
     *
     * @param {CompiledMode} mode
     * @param {Array<RegExp>} regexes
     * @param {{key: "beginScope"|"endScope"}} opts
     */
    function remapScopeNames(mode, regexes, { key }) {
      let offset = 0;
      const scopeNames = mode[key];
      /** @type Record<number,boolean> */
      const emit = {};
      /** @type Record<number,string> */
      const positions = {};

      for (let i = 1; i <= regexes.length; i++) {
        positions[i + offset] = scopeNames[i];
        emit[i + offset] = true;
        offset += countMatchGroups(regexes[i - 1]);
      }
      // we use _emit to keep track of which match groups are "top-level" to avoid double
      // output from inside match groups
      mode[key] = positions;
      mode[key]._emit = emit;
      mode[key]._multi = true;
    }

    /**
     * @param {CompiledMode} mode
     */
    function beginMultiClass(mode) {
      if (!Array.isArray(mode.begin)) return;

      if (mode.skip || mode.excludeBegin || mode.returnBegin) {
        error("skip, excludeBegin, returnBegin not compatible with beginScope: {}");
        throw MultiClassError;
      }

      if (typeof mode.beginScope !== "object" || mode.beginScope === null) {
        error("beginScope must be object");
        throw MultiClassError;
      }

      remapScopeNames(mode, mode.begin, {key: "beginScope"});
      mode.begin = _rewriteBackreferences(mode.begin, { joinWith: "" });
    }

    /**
     * @param {CompiledMode} mode
     */
    function endMultiClass(mode) {
      if (!Array.isArray(mode.end)) return;

      if (mode.skip || mode.excludeEnd || mode.returnEnd) {
        error("skip, excludeEnd, returnEnd not compatible with endScope: {}");
        throw MultiClassError;
      }

      if (typeof mode.endScope !== "object" || mode.endScope === null) {
        error("endScope must be object");
        throw MultiClassError;
      }

      remapScopeNames(mode, mode.end, {key: "endScope"});
      mode.end = _rewriteBackreferences(mode.end, { joinWith: "" });
    }

    /**
     * this exists only to allow `scope: {}` to be used beside `match:`
     * Otherwise `beginScope` would necessary and that would look weird

      {
        match: [ /def/, /\w+/ ]
        scope: { 1: "keyword" , 2: "title" }
      }

     * @param {CompiledMode} mode
     */
    function scopeSugar(mode) {
      if (mode.scope && typeof mode.scope === "object" && mode.scope !== null) {
        mode.beginScope = mode.scope;
        delete mode.scope;
      }
    }

    /**
     * @param {CompiledMode} mode
     */
    function MultiClass(mode) {
      scopeSugar(mode);

      if (typeof mode.beginScope === "string") {
        mode.beginScope = { _wrap: mode.beginScope };
      }
      if (typeof mode.endScope === "string") {
        mode.endScope = { _wrap: mode.endScope };
      }

      beginMultiClass(mode);
      endMultiClass(mode);
    }

    /**
    @typedef {import('highlight.js').Mode} Mode
    @typedef {import('highlight.js').CompiledMode} CompiledMode
    @typedef {import('highlight.js').Language} Language
    @typedef {import('highlight.js').HLJSPlugin} HLJSPlugin
    @typedef {import('highlight.js').CompiledLanguage} CompiledLanguage
    */

    // compilation

    /**
     * Compiles a language definition result
     *
     * Given the raw result of a language definition (Language), compiles this so
     * that it is ready for highlighting code.
     * @param {Language} language
     * @returns {CompiledLanguage}
     */
    function compileLanguage(language) {
      /**
       * Builds a regex with the case sensitivity of the current language
       *
       * @param {RegExp | string} value
       * @param {boolean} [global]
       */
      function langRe(value, global) {
        return new RegExp(
          source(value),
          'm' + (language.case_insensitive ? 'i' : '') + (global ? 'g' : '')
        );
      }

      /**
        Stores multiple regular expressions and allows you to quickly search for
        them all in a string simultaneously - returning the first match.  It does
        this by creating a huge (a|b|c) regex - each individual item wrapped with ()
        and joined by `|` - using match groups to track position.  When a match is
        found checking which position in the array has content allows us to figure
        out which of the original regexes / match groups triggered the match.

        The match object itself (the result of `Regex.exec`) is returned but also
        enhanced by merging in any meta-data that was registered with the regex.
        This is how we keep track of which mode matched, and what type of rule
        (`illegal`, `begin`, end, etc).
      */
      class MultiRegex {
        constructor() {
          this.matchIndexes = {};
          // @ts-ignore
          this.regexes = [];
          this.matchAt = 1;
          this.position = 0;
        }

        // @ts-ignore
        addRule(re, opts) {
          opts.position = this.position++;
          // @ts-ignore
          this.matchIndexes[this.matchAt] = opts;
          this.regexes.push([opts, re]);
          this.matchAt += countMatchGroups(re) + 1;
        }

        compile() {
          if (this.regexes.length === 0) {
            // avoids the need to check length every time exec is called
            // @ts-ignore
            this.exec = () => null;
          }
          const terminators = this.regexes.map(el => el[1]);
          this.matcherRe = langRe(_rewriteBackreferences(terminators, { joinWith: '|' }), true);
          this.lastIndex = 0;
        }

        /** @param {string} s */
        exec(s) {
          this.matcherRe.lastIndex = this.lastIndex;
          const match = this.matcherRe.exec(s);
          if (!match) { return null; }

          // eslint-disable-next-line no-undefined
          const i = match.findIndex((el, i) => i > 0 && el !== undefined);
          // @ts-ignore
          const matchData = this.matchIndexes[i];
          // trim off any earlier non-relevant match groups (ie, the other regex
          // match groups that make up the multi-matcher)
          match.splice(0, i);

          return Object.assign(match, matchData);
        }
      }

      /*
        Created to solve the key deficiently with MultiRegex - there is no way to
        test for multiple matches at a single location.  Why would we need to do
        that?  In the future a more dynamic engine will allow certain matches to be
        ignored.  An example: if we matched say the 3rd regex in a large group but
        decided to ignore it - we'd need to started testing again at the 4th
        regex... but MultiRegex itself gives us no real way to do that.

        So what this class creates MultiRegexs on the fly for whatever search
        position they are needed.

        NOTE: These additional MultiRegex objects are created dynamically.  For most
        grammars most of the time we will never actually need anything more than the
        first MultiRegex - so this shouldn't have too much overhead.

        Say this is our search group, and we match regex3, but wish to ignore it.

          regex1 | regex2 | regex3 | regex4 | regex5    ' ie, startAt = 0

        What we need is a new MultiRegex that only includes the remaining
        possibilities:

          regex4 | regex5                               ' ie, startAt = 3

        This class wraps all that complexity up in a simple API... `startAt` decides
        where in the array of expressions to start doing the matching. It
        auto-increments, so if a match is found at position 2, then startAt will be
        set to 3.  If the end is reached startAt will return to 0.

        MOST of the time the parser will be setting startAt manually to 0.
      */
      class ResumableMultiRegex {
        constructor() {
          // @ts-ignore
          this.rules = [];
          // @ts-ignore
          this.multiRegexes = [];
          this.count = 0;

          this.lastIndex = 0;
          this.regexIndex = 0;
        }

        // @ts-ignore
        getMatcher(index) {
          if (this.multiRegexes[index]) return this.multiRegexes[index];

          const matcher = new MultiRegex();
          this.rules.slice(index).forEach(([re, opts]) => matcher.addRule(re, opts));
          matcher.compile();
          this.multiRegexes[index] = matcher;
          return matcher;
        }

        resumingScanAtSamePosition() {
          return this.regexIndex !== 0;
        }

        considerAll() {
          this.regexIndex = 0;
        }

        // @ts-ignore
        addRule(re, opts) {
          this.rules.push([re, opts]);
          if (opts.type === "begin") this.count++;
        }

        /** @param {string} s */
        exec(s) {
          const m = this.getMatcher(this.regexIndex);
          m.lastIndex = this.lastIndex;
          let result = m.exec(s);

          // The following is because we have no easy way to say "resume scanning at the
          // existing position but also skip the current rule ONLY". What happens is
          // all prior rules are also skipped which can result in matching the wrong
          // thing. Example of matching "booger":

          // our matcher is [string, "booger", number]
          //
          // ....booger....

          // if "booger" is ignored then we'd really need a regex to scan from the
          // SAME position for only: [string, number] but ignoring "booger" (if it
          // was the first match), a simple resume would scan ahead who knows how
          // far looking only for "number", ignoring potential string matches (or
          // future "booger" matches that might be valid.)

          // So what we do: We execute two matchers, one resuming at the same
          // position, but the second full matcher starting at the position after:

          //     /--- resume first regex match here (for [number])
          //     |/---- full match here for [string, "booger", number]
          //     vv
          // ....booger....

          // Which ever results in a match first is then used. So this 3-4 step
          // process essentially allows us to say "match at this position, excluding
          // a prior rule that was ignored".
          //
          // 1. Match "booger" first, ignore. Also proves that [string] does non match.
          // 2. Resume matching for [number]
          // 3. Match at index + 1 for [string, "booger", number]
          // 4. If #2 and #3 result in matches, which came first?
          if (this.resumingScanAtSamePosition()) {
            if (result && result.index === this.lastIndex) ; else { // use the second matcher result
              const m2 = this.getMatcher(0);
              m2.lastIndex = this.lastIndex + 1;
              result = m2.exec(s);
            }
          }

          if (result) {
            this.regexIndex += result.position + 1;
            if (this.regexIndex === this.count) {
              // wrap-around to considering all matches again
              this.considerAll();
            }
          }

          return result;
        }
      }

      /**
       * Given a mode, builds a huge ResumableMultiRegex that can be used to walk
       * the content and find matches.
       *
       * @param {CompiledMode} mode
       * @returns {ResumableMultiRegex}
       */
      function buildModeRegex(mode) {
        const mm = new ResumableMultiRegex();

        mode.contains.forEach(term => mm.addRule(term.begin, { rule: term, type: "begin" }));

        if (mode.terminatorEnd) {
          mm.addRule(mode.terminatorEnd, { type: "end" });
        }
        if (mode.illegal) {
          mm.addRule(mode.illegal, { type: "illegal" });
        }

        return mm;
      }

      /** skip vs abort vs ignore
       *
       * @skip   - The mode is still entered and exited normally (and contains rules apply),
       *           but all content is held and added to the parent buffer rather than being
       *           output when the mode ends.  Mostly used with `sublanguage` to build up
       *           a single large buffer than can be parsed by sublanguage.
       *
       *             - The mode begin ands ends normally.
       *             - Content matched is added to the parent mode buffer.
       *             - The parser cursor is moved forward normally.
       *
       * @abort  - A hack placeholder until we have ignore.  Aborts the mode (as if it
       *           never matched) but DOES NOT continue to match subsequent `contains`
       *           modes.  Abort is bad/suboptimal because it can result in modes
       *           farther down not getting applied because an earlier rule eats the
       *           content but then aborts.
       *
       *             - The mode does not begin.
       *             - Content matched by `begin` is added to the mode buffer.
       *             - The parser cursor is moved forward accordingly.
       *
       * @ignore - Ignores the mode (as if it never matched) and continues to match any
       *           subsequent `contains` modes.  Ignore isn't technically possible with
       *           the current parser implementation.
       *
       *             - The mode does not begin.
       *             - Content matched by `begin` is ignored.
       *             - The parser cursor is not moved forward.
       */

      /**
       * Compiles an individual mode
       *
       * This can raise an error if the mode contains certain detectable known logic
       * issues.
       * @param {Mode} mode
       * @param {CompiledMode | null} [parent]
       * @returns {CompiledMode | never}
       */
      function compileMode(mode, parent) {
        const cmode = /** @type CompiledMode */ (mode);
        if (mode.isCompiled) return cmode;

        [
          scopeClassName,
          // do this early so compiler extensions generally don't have to worry about
          // the distinction between match/begin
          compileMatch,
          MultiClass,
          beforeMatchExt
        ].forEach(ext => ext(mode, parent));

        language.compilerExtensions.forEach(ext => ext(mode, parent));

        // __beforeBegin is considered private API, internal use only
        mode.__beforeBegin = null;

        [
          beginKeywords,
          // do this later so compiler extensions that come earlier have access to the
          // raw array if they wanted to perhaps manipulate it, etc.
          compileIllegal,
          // default to 1 relevance if not specified
          compileRelevance
        ].forEach(ext => ext(mode, parent));

        mode.isCompiled = true;

        let keywordPattern = null;
        if (typeof mode.keywords === "object" && mode.keywords.$pattern) {
          // we need a copy because keywords might be compiled multiple times
          // so we can't go deleting $pattern from the original on the first
          // pass
          mode.keywords = Object.assign({}, mode.keywords);
          keywordPattern = mode.keywords.$pattern;
          delete mode.keywords.$pattern;
        }
        keywordPattern = keywordPattern || /\w+/;

        if (mode.keywords) {
          mode.keywords = compileKeywords(mode.keywords, language.case_insensitive);
        }

        cmode.keywordPatternRe = langRe(keywordPattern, true);

        if (parent) {
          if (!mode.begin) mode.begin = /\B|\b/;
          cmode.beginRe = langRe(mode.begin);
          if (!mode.end && !mode.endsWithParent) mode.end = /\B|\b/;
          if (mode.end) cmode.endRe = langRe(mode.end);
          cmode.terminatorEnd = source(mode.end) || '';
          if (mode.endsWithParent && parent.terminatorEnd) {
            cmode.terminatorEnd += (mode.end ? '|' : '') + parent.terminatorEnd;
          }
        }
        if (mode.illegal) cmode.illegalRe = langRe(/** @type {RegExp | string} */ (mode.illegal));
        if (!mode.contains) mode.contains = [];

        mode.contains = [].concat(...mode.contains.map(function(c) {
          return expandOrCloneMode(c === 'self' ? mode : c);
        }));
        mode.contains.forEach(function(c) { compileMode(/** @type Mode */ (c), cmode); });

        if (mode.starts) {
          compileMode(mode.starts, parent);
        }

        cmode.matcher = buildModeRegex(cmode);
        return cmode;
      }

      if (!language.compilerExtensions) language.compilerExtensions = [];

      // self is not valid at the top-level
      if (language.contains && language.contains.includes('self')) {
        throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
      }

      // we need a null object, which inherit will guarantee
      language.classNameAliases = inherit$1(language.classNameAliases || {});

      return compileMode(/** @type Mode */ (language));
    }

    /**
     * Determines if a mode has a dependency on it's parent or not
     *
     * If a mode does have a parent dependency then often we need to clone it if
     * it's used in multiple places so that each copy points to the correct parent,
     * where-as modes without a parent can often safely be re-used at the bottom of
     * a mode chain.
     *
     * @param {Mode | null} mode
     * @returns {boolean} - is there a dependency on the parent?
     * */
    function dependencyOnParent(mode) {
      if (!mode) return false;

      return mode.endsWithParent || dependencyOnParent(mode.starts);
    }

    /**
     * Expands a mode or clones it if necessary
     *
     * This is necessary for modes with parental dependenceis (see notes on
     * `dependencyOnParent`) and for nodes that have `variants` - which must then be
     * exploded into their own individual modes at compile time.
     *
     * @param {Mode} mode
     * @returns {Mode | Mode[]}
     * */
    function expandOrCloneMode(mode) {
      if (mode.variants && !mode.cachedVariants) {
        mode.cachedVariants = mode.variants.map(function(variant) {
          return inherit$1(mode, { variants: null }, variant);
        });
      }

      // EXPAND
      // if we have variants then essentially "replace" the mode with the variants
      // this happens in compileMode, where this function is called from
      if (mode.cachedVariants) {
        return mode.cachedVariants;
      }

      // CLONE
      // if we have dependencies on parents then we need a unique
      // instance of ourselves, so we can be reused with many
      // different parents without issue
      if (dependencyOnParent(mode)) {
        return inherit$1(mode, { starts: mode.starts ? inherit$1(mode.starts) : null });
      }

      if (Object.isFrozen(mode)) {
        return inherit$1(mode);
      }

      // no special dependency issues, just return ourselves
      return mode;
    }

    var version = "11.1.0";

    /*
    Syntax highlighting with language autodetection.
    https://highlightjs.org/
    */

    /**
    @typedef {import('highlight.js').Mode} Mode
    @typedef {import('highlight.js').CompiledMode} CompiledMode
    @typedef {import('highlight.js').Language} Language
    @typedef {import('highlight.js').HLJSApi} HLJSApi
    @typedef {import('highlight.js').HLJSPlugin} HLJSPlugin
    @typedef {import('highlight.js').PluginEvent} PluginEvent
    @typedef {import('highlight.js').HLJSOptions} HLJSOptions
    @typedef {import('highlight.js').LanguageFn} LanguageFn
    @typedef {import('highlight.js').HighlightedHTMLElement} HighlightedHTMLElement
    @typedef {import('highlight.js').BeforeHighlightContext} BeforeHighlightContext
    @typedef {import('highlight.js/private').MatchType} MatchType
    @typedef {import('highlight.js/private').KeywordData} KeywordData
    @typedef {import('highlight.js/private').EnhancedMatch} EnhancedMatch
    @typedef {import('highlight.js/private').AnnotatedError} AnnotatedError
    @typedef {import('highlight.js').AutoHighlightResult} AutoHighlightResult
    @typedef {import('highlight.js').HighlightOptions} HighlightOptions
    @typedef {import('highlight.js').HighlightResult} HighlightResult
    */


    const escape = escapeHTML$1;
    const inherit = inherit$1;
    const NO_MATCH = Symbol("nomatch");
    const MAX_KEYWORD_HITS = 7;

    /**
     * @param {any} hljs - object that is extended (legacy)
     * @returns {HLJSApi}
     */
    const HLJS = function(hljs) {
      // Global internal variables used within the highlight.js library.
      /** @type {Record<string, Language>} */
      const languages = Object.create(null);
      /** @type {Record<string, string>} */
      const aliases = Object.create(null);
      /** @type {HLJSPlugin[]} */
      const plugins = [];

      // safe/production mode - swallows more errors, tries to keep running
      // even if a single syntax or parse hits a fatal error
      let SAFE_MODE = true;
      const LANGUAGE_NOT_FOUND = "Could not find the language '{}', did you forget to load/include a language module?";
      /** @type {Language} */
      const PLAINTEXT_LANGUAGE = { disableAutodetect: true, name: 'Plain text', contains: [] };

      // Global options used when within external APIs. This is modified when
      // calling the `hljs.configure` function.
      /** @type HLJSOptions */
      let options = {
        ignoreUnescapedHTML: false,
        noHighlightRe: /^(no-?highlight)$/i,
        languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
        classPrefix: 'hljs-',
        cssSelector: 'pre code',
        languages: null,
        // beta configuration options, subject to change, welcome to discuss
        // https://github.com/highlightjs/highlight.js/issues/1086
        __emitter: TokenTreeEmitter
      };

      /* Utility functions */

      /**
       * Tests a language name to see if highlighting should be skipped
       * @param {string} languageName
       */
      function shouldNotHighlight(languageName) {
        return options.noHighlightRe.test(languageName);
      }

      /**
       * @param {HighlightedHTMLElement} block - the HTML element to determine language for
       */
      function blockLanguage(block) {
        let classes = block.className + ' ';

        classes += block.parentNode ? block.parentNode.className : '';

        // language-* takes precedence over non-prefixed class names.
        const match = options.languageDetectRe.exec(classes);
        if (match) {
          const language = getLanguage(match[1]);
          if (!language) {
            warn(LANGUAGE_NOT_FOUND.replace("{}", match[1]));
            warn("Falling back to no-highlight mode for this block.", block);
          }
          return language ? match[1] : 'no-highlight';
        }

        return classes
          .split(/\s+/)
          .find((_class) => shouldNotHighlight(_class) || getLanguage(_class));
      }

      /**
       * Core highlighting function.
       *
       * OLD API
       * highlight(lang, code, ignoreIllegals, continuation)
       *
       * NEW API
       * highlight(code, {lang, ignoreIllegals})
       *
       * @param {string} codeOrLanguageName - the language to use for highlighting
       * @param {string | HighlightOptions} optionsOrCode - the code to highlight
       * @param {boolean} [ignoreIllegals] - whether to ignore illegal matches, default is to bail
       *
       * @returns {HighlightResult} Result - an object that represents the result
       * @property {string} language - the language name
       * @property {number} relevance - the relevance score
       * @property {string} value - the highlighted HTML code
       * @property {string} code - the original raw code
       * @property {CompiledMode} top - top of the current mode stack
       * @property {boolean} illegal - indicates whether any illegal matches were found
      */
      function highlight(codeOrLanguageName, optionsOrCode, ignoreIllegals) {
        let code = "";
        let languageName = "";
        if (typeof optionsOrCode === "object") {
          code = codeOrLanguageName;
          ignoreIllegals = optionsOrCode.ignoreIllegals;
          languageName = optionsOrCode.language;
        } else {
          // old API
          deprecated("10.7.0", "highlight(lang, code, ...args) has been deprecated.");
          deprecated("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277");
          languageName = codeOrLanguageName;
          code = optionsOrCode;
        }

        // https://github.com/highlightjs/highlight.js/issues/3149
        // eslint-disable-next-line no-undefined
        if (ignoreIllegals === undefined) { ignoreIllegals = true; }

        /** @type {BeforeHighlightContext} */
        const context = {
          code,
          language: languageName
        };
        // the plugin can change the desired language or the code to be highlighted
        // just be changing the object it was passed
        fire("before:highlight", context);

        // a before plugin can usurp the result completely by providing it's own
        // in which case we don't even need to call highlight
        const result = context.result
          ? context.result
          : _highlight(context.language, context.code, ignoreIllegals);

        result.code = context.code;
        // the plugin can change anything in result to suite it
        fire("after:highlight", result);

        return result;
      }

      /**
       * private highlight that's used internally and does not fire callbacks
       *
       * @param {string} languageName - the language to use for highlighting
       * @param {string} codeToHighlight - the code to highlight
       * @param {boolean?} [ignoreIllegals] - whether to ignore illegal matches, default is to bail
       * @param {CompiledMode?} [continuation] - current continuation mode, if any
       * @returns {HighlightResult} - result of the highlight operation
      */
      function _highlight(languageName, codeToHighlight, ignoreIllegals, continuation) {
        const keywordHits = Object.create(null);

        /**
         * Return keyword data if a match is a keyword
         * @param {CompiledMode} mode - current mode
         * @param {string} matchText - the textual match
         * @returns {KeywordData | false}
         */
        function keywordData(mode, matchText) {
          return mode.keywords[matchText];
        }

        function processKeywords() {
          if (!top.keywords) {
            emitter.addText(modeBuffer);
            return;
          }

          let lastIndex = 0;
          top.keywordPatternRe.lastIndex = 0;
          let match = top.keywordPatternRe.exec(modeBuffer);
          let buf = "";

          while (match) {
            buf += modeBuffer.substring(lastIndex, match.index);
            const word = language.case_insensitive ? match[0].toLowerCase() : match[0];
            const data = keywordData(top, word);
            if (data) {
              const [kind, keywordRelevance] = data;
              emitter.addText(buf);
              buf = "";

              keywordHits[word] = (keywordHits[word] || 0) + 1;
              if (keywordHits[word] <= MAX_KEYWORD_HITS) relevance += keywordRelevance;
              if (kind.startsWith("_")) {
                // _ implied for relevance only, do not highlight
                // by applying a class name
                buf += match[0];
              } else {
                const cssClass = language.classNameAliases[kind] || kind;
                emitter.addKeyword(match[0], cssClass);
              }
            } else {
              buf += match[0];
            }
            lastIndex = top.keywordPatternRe.lastIndex;
            match = top.keywordPatternRe.exec(modeBuffer);
          }
          buf += modeBuffer.substr(lastIndex);
          emitter.addText(buf);
        }

        function processSubLanguage() {
          if (modeBuffer === "") return;
          /** @type HighlightResult */
          let result = null;

          if (typeof top.subLanguage === 'string') {
            if (!languages[top.subLanguage]) {
              emitter.addText(modeBuffer);
              return;
            }
            result = _highlight(top.subLanguage, modeBuffer, true, continuations[top.subLanguage]);
            continuations[top.subLanguage] = /** @type {CompiledMode} */ (result._top);
          } else {
            result = highlightAuto(modeBuffer, top.subLanguage.length ? top.subLanguage : null);
          }

          // Counting embedded language score towards the host language may be disabled
          // with zeroing the containing mode relevance. Use case in point is Markdown that
          // allows XML everywhere and makes every XML snippet to have a much larger Markdown
          // score.
          if (top.relevance > 0) {
            relevance += result.relevance;
          }
          emitter.addSublanguage(result._emitter, result.language);
        }

        function processBuffer() {
          if (top.subLanguage != null) {
            processSubLanguage();
          } else {
            processKeywords();
          }
          modeBuffer = '';
        }

        /**
         * @param {CompiledMode} mode
         * @param {RegExpMatchArray} match
         */
        function emitMultiClass(scope, match) {
          let i = 1;
          // eslint-disable-next-line no-undefined
          while (match[i] !== undefined) {
            if (!scope._emit[i]) { i++; continue; }
            const klass = language.classNameAliases[scope[i]] || scope[i];
            const text = match[i];
            if (klass) {
              emitter.addKeyword(text, klass);
            } else {
              modeBuffer = text;
              processKeywords();
              modeBuffer = "";
            }
            i++;
          }
        }

        /**
         * @param {CompiledMode} mode - new mode to start
         * @param {RegExpMatchArray} match
         */
        function startNewMode(mode, match) {
          if (mode.scope && typeof mode.scope === "string") {
            emitter.openNode(language.classNameAliases[mode.scope] || mode.scope);
          }
          if (mode.beginScope) {
            // beginScope just wraps the begin match itself in a scope
            if (mode.beginScope._wrap) {
              emitter.addKeyword(modeBuffer, language.classNameAliases[mode.beginScope._wrap] || mode.beginScope._wrap);
              modeBuffer = "";
            } else if (mode.beginScope._multi) {
              // at this point modeBuffer should just be the match
              emitMultiClass(mode.beginScope, match);
              modeBuffer = "";
            }
          }

          top = Object.create(mode, { parent: { value: top } });
          return top;
        }

        /**
         * @param {CompiledMode } mode - the mode to potentially end
         * @param {RegExpMatchArray} match - the latest match
         * @param {string} matchPlusRemainder - match plus remainder of content
         * @returns {CompiledMode | void} - the next mode, or if void continue on in current mode
         */
        function endOfMode(mode, match, matchPlusRemainder) {
          let matched = startsWith(mode.endRe, matchPlusRemainder);

          if (matched) {
            if (mode["on:end"]) {
              const resp = new Response(mode);
              mode["on:end"](match, resp);
              if (resp.isMatchIgnored) matched = false;
            }

            if (matched) {
              while (mode.endsParent && mode.parent) {
                mode = mode.parent;
              }
              return mode;
            }
          }
          // even if on:end fires an `ignore` it's still possible
          // that we might trigger the end node because of a parent mode
          if (mode.endsWithParent) {
            return endOfMode(mode.parent, match, matchPlusRemainder);
          }
        }

        /**
         * Handle matching but then ignoring a sequence of text
         *
         * @param {string} lexeme - string containing full match text
         */
        function doIgnore(lexeme) {
          if (top.matcher.regexIndex === 0) {
            // no more regexes to potentially match here, so we move the cursor forward one
            // space
            modeBuffer += lexeme[0];
            return 1;
          } else {
            // no need to move the cursor, we still have additional regexes to try and
            // match at this very spot
            resumeScanAtSamePosition = true;
            return 0;
          }
        }

        /**
         * Handle the start of a new potential mode match
         *
         * @param {EnhancedMatch} match - the current match
         * @returns {number} how far to advance the parse cursor
         */
        function doBeginMatch(match) {
          const lexeme = match[0];
          const newMode = match.rule;

          const resp = new Response(newMode);
          // first internal before callbacks, then the public ones
          const beforeCallbacks = [newMode.__beforeBegin, newMode["on:begin"]];
          for (const cb of beforeCallbacks) {
            if (!cb) continue;
            cb(match, resp);
            if (resp.isMatchIgnored) return doIgnore(lexeme);
          }

          if (newMode.skip) {
            modeBuffer += lexeme;
          } else {
            if (newMode.excludeBegin) {
              modeBuffer += lexeme;
            }
            processBuffer();
            if (!newMode.returnBegin && !newMode.excludeBegin) {
              modeBuffer = lexeme;
            }
          }
          startNewMode(newMode, match);
          return newMode.returnBegin ? 0 : lexeme.length;
        }

        /**
         * Handle the potential end of mode
         *
         * @param {RegExpMatchArray} match - the current match
         */
        function doEndMatch(match) {
          const lexeme = match[0];
          const matchPlusRemainder = codeToHighlight.substr(match.index);

          const endMode = endOfMode(top, match, matchPlusRemainder);
          if (!endMode) { return NO_MATCH; }

          const origin = top;
          if (top.endScope && top.endScope._wrap) {
            processBuffer();
            emitter.addKeyword(lexeme, top.endScope._wrap);
          } else if (top.endScope && top.endScope._multi) {
            processBuffer();
            emitMultiClass(top.endScope, match);
          } else if (origin.skip) {
            modeBuffer += lexeme;
          } else {
            if (!(origin.returnEnd || origin.excludeEnd)) {
              modeBuffer += lexeme;
            }
            processBuffer();
            if (origin.excludeEnd) {
              modeBuffer = lexeme;
            }
          }
          do {
            if (top.scope && !top.isMultiClass) {
              emitter.closeNode();
            }
            if (!top.skip && !top.subLanguage) {
              relevance += top.relevance;
            }
            top = top.parent;
          } while (top !== endMode.parent);
          if (endMode.starts) {
            startNewMode(endMode.starts, match);
          }
          return origin.returnEnd ? 0 : lexeme.length;
        }

        function processContinuations() {
          const list = [];
          for (let current = top; current !== language; current = current.parent) {
            if (current.scope) {
              list.unshift(current.scope);
            }
          }
          list.forEach(item => emitter.openNode(item));
        }

        /** @type {{type?: MatchType, index?: number, rule?: Mode}}} */
        let lastMatch = {};

        /**
         *  Process an individual match
         *
         * @param {string} textBeforeMatch - text preceding the match (since the last match)
         * @param {EnhancedMatch} [match] - the match itself
         */
        function processLexeme(textBeforeMatch, match) {
          const lexeme = match && match[0];

          // add non-matched text to the current mode buffer
          modeBuffer += textBeforeMatch;

          if (lexeme == null) {
            processBuffer();
            return 0;
          }

          // we've found a 0 width match and we're stuck, so we need to advance
          // this happens when we have badly behaved rules that have optional matchers to the degree that
          // sometimes they can end up matching nothing at all
          // Ref: https://github.com/highlightjs/highlight.js/issues/2140
          if (lastMatch.type === "begin" && match.type === "end" && lastMatch.index === match.index && lexeme === "") {
            // spit the "skipped" character that our regex choked on back into the output sequence
            modeBuffer += codeToHighlight.slice(match.index, match.index + 1);
            if (!SAFE_MODE) {
              /** @type {AnnotatedError} */
              const err = new Error(`0 width match regex (${languageName})`);
              err.languageName = languageName;
              err.badRule = lastMatch.rule;
              throw err;
            }
            return 1;
          }
          lastMatch = match;

          if (match.type === "begin") {
            return doBeginMatch(match);
          } else if (match.type === "illegal" && !ignoreIllegals) {
            // illegal match, we do not continue processing
            /** @type {AnnotatedError} */
            const err = new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.scope || '<unnamed>') + '"');
            err.mode = top;
            throw err;
          } else if (match.type === "end") {
            const processed = doEndMatch(match);
            if (processed !== NO_MATCH) {
              return processed;
            }
          }

          // edge case for when illegal matches $ (end of line) which is technically
          // a 0 width match but not a begin/end match so it's not caught by the
          // first handler (when ignoreIllegals is true)
          if (match.type === "illegal" && lexeme === "") {
            // advance so we aren't stuck in an infinite loop
            return 1;
          }

          // infinite loops are BAD, this is a last ditch catch all. if we have a
          // decent number of iterations yet our index (cursor position in our
          // parsing) still 3x behind our index then something is very wrong
          // so we bail
          if (iterations > 100000 && iterations > match.index * 3) {
            const err = new Error('potential infinite loop, way more iterations than matches');
            throw err;
          }

          /*
          Why might be find ourselves here?  An potential end match that was
          triggered but could not be completed.  IE, `doEndMatch` returned NO_MATCH.
          (this could be because a callback requests the match be ignored, etc)

          This causes no real harm other than stopping a few times too many.
          */

          modeBuffer += lexeme;
          return lexeme.length;
        }

        const language = getLanguage(languageName);
        if (!language) {
          error(LANGUAGE_NOT_FOUND.replace("{}", languageName));
          throw new Error('Unknown language: "' + languageName + '"');
        }

        const md = compileLanguage(language);
        let result = '';
        /** @type {CompiledMode} */
        let top = continuation || md;
        /** @type Record<string,CompiledMode> */
        const continuations = {}; // keep continuations for sub-languages
        const emitter = new options.__emitter(options);
        processContinuations();
        let modeBuffer = '';
        let relevance = 0;
        let index = 0;
        let iterations = 0;
        let resumeScanAtSamePosition = false;

        try {
          top.matcher.considerAll();

          for (;;) {
            iterations++;
            if (resumeScanAtSamePosition) {
              // only regexes not matched previously will now be
              // considered for a potential match
              resumeScanAtSamePosition = false;
            } else {
              top.matcher.considerAll();
            }
            top.matcher.lastIndex = index;

            const match = top.matcher.exec(codeToHighlight);
            // console.log("match", match[0], match.rule && match.rule.begin)

            if (!match) break;

            const beforeMatch = codeToHighlight.substring(index, match.index);
            const processedCount = processLexeme(beforeMatch, match);
            index = match.index + processedCount;
          }
          processLexeme(codeToHighlight.substr(index));
          emitter.closeAllNodes();
          emitter.finalize();
          result = emitter.toHTML();

          return {
            language: languageName,
            value: result,
            relevance: relevance,
            illegal: false,
            _emitter: emitter,
            _top: top
          };
        } catch (err) {
          if (err.message && err.message.includes('Illegal')) {
            return {
              language: languageName,
              value: escape(codeToHighlight),
              illegal: true,
              relevance: 0,
              _illegalBy: {
                message: err.message,
                index: index,
                context: codeToHighlight.slice(index - 100, index + 100),
                mode: err.mode,
                resultSoFar: result
              },
              _emitter: emitter
            };
          } else if (SAFE_MODE) {
            return {
              language: languageName,
              value: escape(codeToHighlight),
              illegal: false,
              relevance: 0,
              errorRaised: err,
              _emitter: emitter,
              _top: top
            };
          } else {
            throw err;
          }
        }
      }

      /**
       * returns a valid highlight result, without actually doing any actual work,
       * auto highlight starts with this and it's possible for small snippets that
       * auto-detection may not find a better match
       * @param {string} code
       * @returns {HighlightResult}
       */
      function justTextHighlightResult(code) {
        const result = {
          value: escape(code),
          illegal: false,
          relevance: 0,
          _top: PLAINTEXT_LANGUAGE,
          _emitter: new options.__emitter(options)
        };
        result._emitter.addText(code);
        return result;
      }

      /**
      Highlighting with language detection. Accepts a string with the code to
      highlight. Returns an object with the following properties:

      - language (detected language)
      - relevance (int)
      - value (an HTML string with highlighting markup)
      - secondBest (object with the same structure for second-best heuristically
        detected language, may be absent)

        @param {string} code
        @param {Array<string>} [languageSubset]
        @returns {AutoHighlightResult}
      */
      function highlightAuto(code, languageSubset) {
        languageSubset = languageSubset || options.languages || Object.keys(languages);
        const plaintext = justTextHighlightResult(code);

        const results = languageSubset.filter(getLanguage).filter(autoDetection).map(name =>
          _highlight(name, code, false)
        );
        results.unshift(plaintext); // plaintext is always an option

        const sorted = results.sort((a, b) => {
          // sort base on relevance
          if (a.relevance !== b.relevance) return b.relevance - a.relevance;

          // always award the tie to the base language
          // ie if C++ and Arduino are tied, it's more likely to be C++
          if (a.language && b.language) {
            if (getLanguage(a.language).supersetOf === b.language) {
              return 1;
            } else if (getLanguage(b.language).supersetOf === a.language) {
              return -1;
            }
          }

          // otherwise say they are equal, which has the effect of sorting on
          // relevance while preserving the original ordering - which is how ties
          // have historically been settled, ie the language that comes first always
          // wins in the case of a tie
          return 0;
        });

        const [best, secondBest] = sorted;

        /** @type {AutoHighlightResult} */
        const result = best;
        result.secondBest = secondBest;

        return result;
      }

      /**
       * Builds new class name for block given the language name
       *
       * @param {HTMLElement} element
       * @param {string} [currentLang]
       * @param {string} [resultLang]
       */
      function updateClassName(element, currentLang, resultLang) {
        const language = (currentLang && aliases[currentLang]) || resultLang;

        element.classList.add("hljs");
        element.classList.add(`language-${language}`);
      }

      /**
       * Applies highlighting to a DOM node containing code.
       *
       * @param {HighlightedHTMLElement} element - the HTML element to highlight
      */
      function highlightElement(element) {
        /** @type HTMLElement */
        let node = null;
        const language = blockLanguage(element);

        if (shouldNotHighlight(language)) return;

        fire("before:highlightElement",
          { el: element, language: language });

        // we should be all text, no child nodes
        if (!options.ignoreUnescapedHTML && element.children.length > 0) {
          console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk.");
          console.warn("https://github.com/highlightjs/highlight.js/issues/2886");
          console.warn(element);
        }

        node = element;
        const text = node.textContent;
        const result = language ? highlight(text, { language, ignoreIllegals: true }) : highlightAuto(text);

        element.innerHTML = result.value;
        updateClassName(element, language, result.language);
        element.result = {
          language: result.language,
          // TODO: remove with version 11.0
          re: result.relevance,
          relevance: result.relevance
        };
        if (result.secondBest) {
          element.secondBest = {
            language: result.secondBest.language,
            relevance: result.secondBest.relevance
          };
        }

        fire("after:highlightElement", { el: element, result, text });
      }

      /**
       * Updates highlight.js global options with the passed options
       *
       * @param {Partial<HLJSOptions>} userOptions
       */
      function configure(userOptions) {
        options = inherit(options, userOptions);
      }

      // TODO: remove v12, deprecated
      const initHighlighting = () => {
        highlightAll();
        deprecated("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
      };

      // TODO: remove v12, deprecated
      function initHighlightingOnLoad() {
        highlightAll();
        deprecated("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
      }

      let wantsHighlight = false;

      /**
       * auto-highlights all pre>code elements on the page
       */
      function highlightAll() {
        // if we are called too early in the loading process
        if (document.readyState === "loading") {
          wantsHighlight = true;
          return;
        }

        const blocks = document.querySelectorAll(options.cssSelector);
        blocks.forEach(highlightElement);
      }

      function boot() {
        // if a highlight was requested before DOM was loaded, do now
        if (wantsHighlight) highlightAll();
      }

      // make sure we are in the browser environment
      if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('DOMContentLoaded', boot, false);
      }

      /**
       * Register a language grammar module
       *
       * @param {string} languageName
       * @param {LanguageFn} languageDefinition
       */
      function registerLanguage(languageName, languageDefinition) {
        let lang = null;
        try {
          lang = languageDefinition(hljs);
        } catch (error$1) {
          error("Language definition for '{}' could not be registered.".replace("{}", languageName));
          // hard or soft error
          if (!SAFE_MODE) { throw error$1; } else { error(error$1); }
          // languages that have serious errors are replaced with essentially a
          // "plaintext" stand-in so that the code blocks will still get normal
          // css classes applied to them - and one bad language won't break the
          // entire highlighter
          lang = PLAINTEXT_LANGUAGE;
        }
        // give it a temporary name if it doesn't have one in the meta-data
        if (!lang.name) lang.name = languageName;
        languages[languageName] = lang;
        lang.rawDefinition = languageDefinition.bind(null, hljs);

        if (lang.aliases) {
          registerAliases(lang.aliases, { languageName });
        }
      }

      /**
       * Remove a language grammar module
       *
       * @param {string} languageName
       */
      function unregisterLanguage(languageName) {
        delete languages[languageName];
        for (const alias of Object.keys(aliases)) {
          if (aliases[alias] === languageName) {
            delete aliases[alias];
          }
        }
      }

      /**
       * @returns {string[]} List of language internal names
       */
      function listLanguages() {
        return Object.keys(languages);
      }

      /**
       * @param {string} name - name of the language to retrieve
       * @returns {Language | undefined}
       */
      function getLanguage(name) {
        name = (name || '').toLowerCase();
        return languages[name] || languages[aliases[name]];
      }

      /**
       *
       * @param {string|string[]} aliasList - single alias or list of aliases
       * @param {{languageName: string}} opts
       */
      function registerAliases(aliasList, { languageName }) {
        if (typeof aliasList === 'string') {
          aliasList = [aliasList];
        }
        aliasList.forEach(alias => { aliases[alias.toLowerCase()] = languageName; });
      }

      /**
       * Determines if a given language has auto-detection enabled
       * @param {string} name - name of the language
       */
      function autoDetection(name) {
        const lang = getLanguage(name);
        return lang && !lang.disableAutodetect;
      }

      /**
       * Upgrades the old highlightBlock plugins to the new
       * highlightElement API
       * @param {HLJSPlugin} plugin
       */
      function upgradePluginAPI(plugin) {
        // TODO: remove with v12
        if (plugin["before:highlightBlock"] && !plugin["before:highlightElement"]) {
          plugin["before:highlightElement"] = (data) => {
            plugin["before:highlightBlock"](
              Object.assign({ block: data.el }, data)
            );
          };
        }
        if (plugin["after:highlightBlock"] && !plugin["after:highlightElement"]) {
          plugin["after:highlightElement"] = (data) => {
            plugin["after:highlightBlock"](
              Object.assign({ block: data.el }, data)
            );
          };
        }
      }

      /**
       * @param {HLJSPlugin} plugin
       */
      function addPlugin(plugin) {
        upgradePluginAPI(plugin);
        plugins.push(plugin);
      }

      /**
       *
       * @param {PluginEvent} event
       * @param {any} args
       */
      function fire(event, args) {
        const cb = event;
        plugins.forEach(function(plugin) {
          if (plugin[cb]) {
            plugin[cb](args);
          }
        });
      }

      /**
       * DEPRECATED
       * @param {HighlightedHTMLElement} el
       */
      function deprecateHighlightBlock(el) {
        deprecated("10.7.0", "highlightBlock will be removed entirely in v12.0");
        deprecated("10.7.0", "Please use highlightElement now.");

        return highlightElement(el);
      }

      /* Interface definition */
      Object.assign(hljs, {
        highlight,
        highlightAuto,
        highlightAll,
        highlightElement,
        // TODO: Remove with v12 API
        highlightBlock: deprecateHighlightBlock,
        configure,
        initHighlighting,
        initHighlightingOnLoad,
        registerLanguage,
        unregisterLanguage,
        listLanguages,
        getLanguage,
        registerAliases,
        autoDetection,
        inherit,
        addPlugin
      });

      hljs.debugMode = function() { SAFE_MODE = false; };
      hljs.safeMode = function() { SAFE_MODE = true; };
      hljs.versionString = version;

      for (const key in MODES) {
        // @ts-ignore
        if (typeof MODES[key] === "object") {
          // @ts-ignore
          deepFreeze$1(MODES[key]);
        }
      }

      // merge all the modes/regexes into our main object
      Object.assign(hljs, MODES);

      return hljs;
    };

    // export an "instance" of the highlighter
    var highlight$1 = HLJS({});

    var core = highlight$1;

    // https://nodejs.org/api/packages.html#packages_writing_dual_packages_while_avoiding_or_minimizing_hazards

    /*
    Language: JSON
    Description: JSON (JavaScript Object Notation) is a lightweight data-interchange format.
    Author: Ivan Sagalaev <maniac@softwaremaniacs.org>
    Website: http://www.json.org
    Category: common, protocols, web
    */

    function json(hljs) {
      const ATTRIBUTE = {
        className: 'attr',
        begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
        relevance: 1.01
      };
      const PUNCTUATION = {
        match: /[{}[\],:]/,
        className: "punctuation",
        relevance: 0
      };
      // normally we would rely on `keywords` for this but using a mode here allows us
      // to use the very tight `illegal: \S` rule later to flag any other character
      // as illegal indicating that despite looking like JSON we do not truly have
      // JSON and thus improve false-positively greatly since JSON will try and claim
      // all sorts of JSON looking stuff
      const LITERALS = {
        beginKeywords: [
          "true",
          "false",
          "null"
        ].join(" ")
      };

      return {
        name: 'JSON',
        contains: [
          ATTRIBUTE,
          PUNCTUATION,
          hljs.QUOTE_STRING_MODE,
          LITERALS,
          hljs.C_NUMBER_MODE,
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE
        ],
        illegal: '\\S'
      };
    }

    core.registerLanguage("json", json);
    function stringify(msg, o = { formatted: false }) {
      const jsonFormatted = JSON.stringify(JSON.parse(msg), null, 4);
      let html = core.highlightAuto(msg).value;
      if (o.formatted) {
        html = `<pre>${core.highlightAuto(jsonFormatted).value}</pre>`;
      }
      return html;
    }

    const highlight = (txt, search) => {
      if (!search)
        return txt;
      const text = txt.split(" ");
      for (let i = 0; i < text.length; i++) {
        let index = text[i];
        let splitIndex = index.split("");
        if (index.toLowerCase().includes(search.toLowerCase())) {
          for (let si = 0; si < index.length; si++) {
            if (search.toLowerCase().includes(index[si].toLowerCase())) {
              splitIndex[si] = `<mark>${index[si]}</mark>`;
              text[i] = splitIndex.join("");
            }
          }
        }
      }
      return text.join(" ");
    };

    function escapeHTML(str) {
      return new Option(str).innerHTML;
    }

    /* src\pages\Logs\Item.svelte generated by Svelte v3.24.1 */

    function create_if_block$5(ctx) {
    	let li;
    	let div0;
    	let span0;
    	let t0_value = /*log*/ ctx[0].error_type + "";
    	let t0;
    	let t1;
    	let show_if_2 = /*isJson*/ ctx[4](/*log*/ ctx[0].message);
    	let t2;
    	let span1;
    	let t3_value = formatRelative(new Date(/*log*/ ctx[0].updated_at), new Date()) + "";
    	let t3;
    	let span1_title_value;
    	let t4;
    	let span2;
    	let t5_value = format(new Date(/*log*/ ctx[0].updated_at), "dd/MM hh:mm:ss") + "";
    	let t5;
    	let t6;
    	let div1;
    	let show_if_1;
    	let li_class_value;
    	let t7;
    	let show_if = /*log*/ ctx[0].id === get_store_value(/*cachedLastId*/ ctx[1]);
    	let if_block2_anchor;
    	let if_block0 = show_if_2 && create_if_block_3$1(ctx);

    	function select_block_type(ctx, dirty) {
    		if (show_if_1 == null || dirty & /*log*/ 1) show_if_1 = !!/*isJson*/ ctx[4](/*log*/ ctx[0].message);
    		if (show_if_1) return create_if_block_2$1;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx, -1);
    	let if_block1 = current_block_type(ctx);
    	let if_block2 = show_if && create_if_block_1$2();

    	return {
    		c() {
    			li = element("li");
    			div0 = element("div");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			span1 = element("span");
    			t3 = text(t3_value);
    			t4 = space();
    			span2 = element("span");
    			t5 = text(t5_value);
    			t6 = space();
    			div1 = element("div");
    			if_block1.c();
    			t7 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    			this.h();
    		},
    		l(nodes) {
    			li = claim_element(nodes, "LI", { class: true });
    			var li_nodes = children(li);
    			div0 = claim_element(li_nodes, "DIV", { class: true });
    			var div0_nodes = children(div0);
    			span0 = claim_element(div0_nodes, "SPAN", { class: true });
    			var span0_nodes = children(span0);
    			t0 = claim_text(span0_nodes, t0_value);
    			span0_nodes.forEach(detach);
    			t1 = claim_space(div0_nodes);
    			if (if_block0) if_block0.l(div0_nodes);
    			div0_nodes.forEach(detach);
    			t2 = claim_space(li_nodes);
    			span1 = claim_element(li_nodes, "SPAN", { class: true, title: true });
    			var span1_nodes = children(span1);
    			t3 = claim_text(span1_nodes, t3_value);
    			span1_nodes.forEach(detach);
    			t4 = claim_space(li_nodes);
    			span2 = claim_element(li_nodes, "SPAN", { class: true });
    			var span2_nodes = children(span2);
    			t5 = claim_text(span2_nodes, t5_value);
    			span2_nodes.forEach(detach);
    			t6 = claim_space(li_nodes);
    			div1 = claim_element(li_nodes, "DIV", { class: true });
    			var div1_nodes = children(div1);
    			if_block1.l(div1_nodes);
    			div1_nodes.forEach(detach);
    			li_nodes.forEach(detach);
    			t7 = claim_space(nodes);
    			if (if_block2) if_block2.l(nodes);
    			if_block2_anchor = empty();
    			this.h();
    		},
    		h() {
    			attr(span0, "class", "mx-2 break-all");
    			attr(div0, "class", "flex flex-wrap items-center lg:w-48");
    			attr(span1, "class", "mx-2 text-xs lg:order-first lg:hidden");
    			attr(span1, "title", span1_title_value = format(new Date(/*log*/ ctx[0].updated_at), "dd/MM hh:mm:ss"));
    			attr(span2, "class", "mx-2 text-xs lg:order-first lg:inline-flex hidden");
    			attr(div1, "class", "w-full break-all items-start pl-2 mt-1");
    			attr(li, "class", li_class_value = "" + ((/*log*/ ctx[0].isHighlighted ? "text-red-800" : "") + "\r\n    text-sm mb-2\r\n    flex flex-wrap lg:flex-nowrap items-start justify-between shadow border border-gray-200 p-2\r\n    "));
    		},
    		m(target, anchor) {
    			insert(target, li, anchor);
    			append(li, div0);
    			append(div0, span0);
    			append(span0, t0);
    			append(div0, t1);
    			if (if_block0) if_block0.m(div0, null);
    			append(li, t2);
    			append(li, span1);
    			append(span1, t3);
    			append(li, t4);
    			append(li, span2);
    			append(span2, t5);
    			append(li, t6);
    			append(li, div1);
    			if_block1.m(div1, null);
    			insert(target, t7, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert(target, if_block2_anchor, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*log*/ 1 && t0_value !== (t0_value = /*log*/ ctx[0].error_type + "")) set_data(t0, t0_value);
    			if (dirty & /*log*/ 1) show_if_2 = /*isJson*/ ctx[4](/*log*/ ctx[0].message);

    			if (show_if_2) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3$1(ctx);
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*log*/ 1 && t3_value !== (t3_value = formatRelative(new Date(/*log*/ ctx[0].updated_at), new Date()) + "")) set_data(t3, t3_value);

    			if (dirty & /*log*/ 1 && span1_title_value !== (span1_title_value = format(new Date(/*log*/ ctx[0].updated_at), "dd/MM hh:mm:ss"))) {
    				attr(span1, "title", span1_title_value);
    			}

    			if (dirty & /*log*/ 1 && t5_value !== (t5_value = format(new Date(/*log*/ ctx[0].updated_at), "dd/MM hh:mm:ss") + "")) set_data(t5, t5_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			}

    			if (dirty & /*log*/ 1 && li_class_value !== (li_class_value = "" + ((/*log*/ ctx[0].isHighlighted ? "text-red-800" : "") + "\r\n    text-sm mb-2\r\n    flex flex-wrap lg:flex-nowrap items-start justify-between shadow border border-gray-200 p-2\r\n    "))) {
    				attr(li, "class", li_class_value);
    			}

    			if (dirty & /*log, cachedLastId*/ 3) show_if = /*log*/ ctx[0].id === get_store_value(/*cachedLastId*/ ctx[1]);

    			if (show_if) {
    				if (if_block2) ; else {
    					if_block2 = create_if_block_1$2();
    					if_block2.c();
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(li);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    			if (detaching) detach(t7);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach(if_block2_anchor);
    		}
    	};
    }

    // (45:6) {#if isJson(log.message)}
    function create_if_block_3$1(ctx) {
    	let label;
    	let input;
    	let input_name_value;
    	let input_id_value;
    	let t;
    	let label_for_value;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			label = element("label");
    			input = element("input");
    			t = text("\r\n          Prettify");
    			this.h();
    		},
    		l(nodes) {
    			label = claim_element(nodes, "LABEL", { for: true, class: true });
    			var label_nodes = children(label);

    			input = claim_element(label_nodes, "INPUT", {
    				type: true,
    				class: true,
    				name: true,
    				id: true
    			});

    			t = claim_text(label_nodes, "\r\n          Prettify");
    			label_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(input, "type", "checkbox");
    			attr(input, "class", "cursor-pointer w-4 h-4");
    			attr(input, "name", input_name_value = "cv-" + /*log*/ ctx[0].id);
    			attr(input, "id", input_id_value = "cv-" + /*log*/ ctx[0].id);
    			attr(label, "for", label_for_value = "cv-" + /*log*/ ctx[0].id);
    			attr(label, "class", "cursor-pointer px-2 py-1 lg:ml-2 lg:mt-2 bg-gray-100");
    		},
    		m(target, anchor) {
    			insert(target, label, anchor);
    			append(label, input);
    			input.checked = /*formatted*/ ctx[3];
    			append(label, t);

    			if (!mounted) {
    				dispose = listen(input, "change", /*input_change_handler*/ ctx[6]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (dirty & /*log*/ 1 && input_name_value !== (input_name_value = "cv-" + /*log*/ ctx[0].id)) {
    				attr(input, "name", input_name_value);
    			}

    			if (dirty & /*log*/ 1 && input_id_value !== (input_id_value = "cv-" + /*log*/ ctx[0].id)) {
    				attr(input, "id", input_id_value);
    			}

    			if (dirty & /*formatted*/ 8) {
    				input.checked = /*formatted*/ ctx[3];
    			}

    			if (dirty & /*log*/ 1 && label_for_value !== (label_for_value = "cv-" + /*log*/ ctx[0].id)) {
    				attr(label, "for", label_for_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(label);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (77:6) {:else}
    function create_else_block$4(ctx) {
    	let html_tag;
    	let raw_value = highlight(escapeHTML(/*log*/ ctx[0].message), /*filter*/ ctx[2]) + "";
    	let html_anchor;

    	return {
    		c() {
    			html_anchor = empty();
    			this.h();
    		},
    		l(nodes) {
    			html_anchor = empty();
    			this.h();
    		},
    		h() {
    			html_tag = new HtmlTag(html_anchor);
    		},
    		m(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert(target, html_anchor, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*log, filter*/ 5 && raw_value !== (raw_value = highlight(escapeHTML(/*log*/ ctx[0].message), /*filter*/ ctx[2]) + "")) html_tag.p(raw_value);
    		},
    		d(detaching) {
    			if (detaching) detach(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};
    }

    // (73:6) {#if isJson(log.message)}
    function create_if_block_2$1(ctx) {
    	let p;
    	let raw_value = stringify(/*log*/ ctx[0].message, { formatted: /*formatted*/ ctx[3] }) + "";
    	let p_class_value;

    	return {
    		c() {
    			p = element("p");
    			this.h();
    		},
    		l(nodes) {
    			p = claim_element(nodes, "P", { class: true });
    			var p_nodes = children(p);
    			p_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(p, "class", p_class_value = "font-mono overflow-x-auto " + (/*formatted*/ ctx[3] ? "" : "max-h-96"));
    		},
    		m(target, anchor) {
    			insert(target, p, anchor);
    			p.innerHTML = raw_value;
    		},
    		p(ctx, dirty) {
    			if (dirty & /*log, formatted*/ 9 && raw_value !== (raw_value = stringify(/*log*/ ctx[0].message, { formatted: /*formatted*/ ctx[3] }) + "")) p.innerHTML = raw_value;
    			if (dirty & /*formatted*/ 8 && p_class_value !== (p_class_value = "font-mono overflow-x-auto " + (/*formatted*/ ctx[3] ? "" : "max-h-96"))) {
    				attr(p, "class", p_class_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(p);
    		}
    	};
    }

    // (83:2) {#if log.id === get(cachedLastId)}
    function create_if_block_1$2(ctx) {
    	let li;
    	let hr;
    	let t0;
    	let span;
    	let t1;

    	return {
    		c() {
    			li = element("li");
    			hr = element("hr");
    			t0 = space();
    			span = element("span");
    			t1 = text("NEW");
    			this.h();
    		},
    		l(nodes) {
    			li = claim_element(nodes, "LI", { class: true });
    			var li_nodes = children(li);
    			hr = claim_element(li_nodes, "HR", { class: true });
    			t0 = claim_space(li_nodes);
    			span = claim_element(li_nodes, "SPAN", { class: true });
    			var span_nodes = children(span);
    			t1 = claim_text(span_nodes, "NEW");
    			span_nodes.forEach(detach);
    			li_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(hr, "class", "bg-red-700 h-1");
    			attr(span, "class", "text-sm absolute -top-3 left-1/2 bg-white px-4 py-1");
    			attr(li, "class", "relative my-5");
    		},
    		m(target, anchor) {
    			insert(target, li, anchor);
    			append(li, hr);
    			append(li, t0);
    			append(li, span);
    			append(span, t1);
    		},
    		d(detaching) {
    			if (detaching) detach(li);
    		}
    	};
    }

    function create_fragment$d(ctx) {
    	let show_if = /*shouldShow*/ ctx[5](/*log*/ ctx[0], /*filter*/ ctx[2]);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block$5(ctx);

    	return {
    		c() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l(nodes) {
    			if (if_block) if_block.l(nodes);
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*log, filter*/ 5) show_if = /*shouldShow*/ ctx[5](/*log*/ ctx[0], /*filter*/ ctx[2]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance$d($$self, $$props, $$invalidate) {
    	const isJson = msg => {
    		try {
    			JSON.parse(msg);
    			return true;
    		} catch(e) {
    			return false;
    		}
    	};

    	const shouldShow = ({ error_type, message }, filter) => {
    		const typeLower = log.error_type.toLowerCase();
    		const messageLower = log.message.toLowerCase();
    		const filterL = filter.toLowerCase();
    		return typeLower.indexOf(filterL) > -1 || messageLower.indexOf(filterL) > -1;
    	};

    	let { log } = $$props;
    	let { cachedLastId } = $$props;
    	let { filter } = $$props;
    	let formatted = false;

    	function input_change_handler() {
    		formatted = this.checked;
    		$$invalidate(3, formatted);
    	}

    	$$self.$$set = $$props => {
    		if ("log" in $$props) $$invalidate(0, log = $$props.log);
    		if ("cachedLastId" in $$props) $$invalidate(1, cachedLastId = $$props.cachedLastId);
    		if ("filter" in $$props) $$invalidate(2, filter = $$props.filter);
    	};

    	return [log, cachedLastId, filter, formatted, isJson, shouldShow, input_change_handler];
    }

    class Item extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$1(this, options, instance$d, create_fragment$d, safe_not_equal, { log: 0, cachedLastId: 1, filter: 2 });
    	}
    }

    var Item$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Item
    });

    /* src\pages\Logs\index.svelte generated by Svelte v3.24.1 */

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (30:4) {#each $logs as log}
    function create_each_block$5(ctx) {
    	let item;
    	let current;

    	item = new Item({
    			props: {
    				log: /*log*/ ctx[3],
    				cachedLastId,
    				filter: /*filter*/ ctx[0]
    			}
    		});

    	return {
    		c() {
    			create_component(item.$$.fragment);
    		},
    		l(nodes) {
    			claim_component(item.$$.fragment, nodes);
    		},
    		m(target, anchor) {
    			mount_component(item, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const item_changes = {};
    			if (dirty & /*$logs*/ 2) item_changes.log = /*log*/ ctx[3];
    			if (dirty & /*filter*/ 1) item_changes.filter = /*filter*/ ctx[0];
    			item.$set(item_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(item.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(item.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(item, detaching);
    		}
    	};
    }

    function create_fragment$c(ctx) {
    	let p1;
    	let label;
    	let p0;
    	let t0;
    	let t1;
    	let input;
    	let t2;
    	let button;
    	let t3;
    	let t4;
    	let section;
    	let ul;
    	let t5;
    	let p2;
    	let t6;
    	let t7_value = POLLING_INTERVAL / 1000 + "";
    	let t7;
    	let t8;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*$logs*/ ctx[1];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	return {
    		c() {
    			p1 = element("p");
    			label = element("label");
    			p0 = element("p");
    			t0 = text("Filter:");
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			button = element("button");
    			t3 = text("Clear screen");
    			t4 = space();
    			section = element("section");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			p2 = element("p");
    			t6 = text("Polling for new logs every ");
    			t7 = text(t7_value);
    			t8 = text(" seconds.");
    			this.h();
    		},
    		l(nodes) {
    			p1 = claim_element(nodes, "P", { class: true });
    			var p1_nodes = children(p1);
    			label = claim_element(p1_nodes, "LABEL", { for: true, class: true });
    			var label_nodes = children(label);
    			p0 = claim_element(label_nodes, "P", { class: true, title: true });
    			var p0_nodes = children(p0);
    			t0 = claim_text(p0_nodes, "Filter:");
    			p0_nodes.forEach(detach);
    			t1 = claim_space(label_nodes);
    			input = claim_element(label_nodes, "INPUT", { type: true, class: true });
    			label_nodes.forEach(detach);
    			t2 = claim_space(p1_nodes);
    			button = claim_element(p1_nodes, "BUTTON", { class: true });
    			var button_nodes = children(button);
    			t3 = claim_text(button_nodes, "Clear screen");
    			button_nodes.forEach(detach);
    			p1_nodes.forEach(detach);
    			t4 = claim_space(nodes);
    			section = claim_element(nodes, "SECTION", { class: true });
    			var section_nodes = children(section);
    			ul = claim_element(section_nodes, "UL", {});
    			var ul_nodes = children(ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(ul_nodes);
    			}

    			ul_nodes.forEach(detach);
    			t5 = claim_space(section_nodes);
    			p2 = claim_element(section_nodes, "P", {});
    			var p2_nodes = children(p2);
    			t6 = claim_text(p2_nodes, "Polling for new logs every ");
    			t7 = claim_text(p2_nodes, t7_value);
    			t8 = claim_text(p2_nodes, " seconds.");
    			p2_nodes.forEach(detach);
    			section_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(p0, "class", "mr-2 text-lg text-white");
    			attr(p0, "title", "Filter by log type and message text");
    			attr(input, "type", "text");
    			attr(input, "class", "border text-lg outline-none border-gray-200 px-2 py-1 w-96");
    			attr(label, "for", "");
    			attr(label, "class", "flex items-center");
    			attr(button, "class", "ml-auto bg-white text-gray-700 px-2 py-1");
    			attr(p1, "class", "bg-gray-700 font-light flex justify-between items-center text-sm border-yellow-600 px-3 py-2 mb-4 sticky top-0");
    			attr(section, "class", "xl:container");
    		},
    		m(target, anchor) {
    			insert(target, p1, anchor);
    			append(p1, label);
    			append(label, p0);
    			append(p0, t0);
    			append(label, t1);
    			append(label, input);
    			set_input_value(input, /*filter*/ ctx[0]);
    			append(p1, t2);
    			append(p1, button);
    			append(button, t3);
    			insert(target, t4, anchor);
    			insert(target, section, anchor);
    			append(section, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append(section, t5);
    			append(section, p2);
    			append(p2, t6);
    			append(p2, t7);
    			append(p2, t8);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(input, "input", /*input_input_handler*/ ctx[2]),
    					listen(button, "click", clearLogs)
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*filter*/ 1 && input.value !== /*filter*/ ctx[0]) {
    				set_input_value(input, /*filter*/ ctx[0]);
    			}

    			if (dirty & /*$logs, cachedLastId, filter*/ 3) {
    				each_value = /*$logs*/ ctx[1];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(p1);
    			if (detaching) detach(t4);
    			if (detaching) detach(section);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    const POLLING_INTERVAL = 3000;

    function instance$c($$self, $$props, $$invalidate) {
    	let $logs;
    	component_subscribe($$self, logs, $$value => $$invalidate(1, $logs = $$value));
    	let filter = "";

    	onMount(async () => {
    		fetchLogs();
    		setInterval(fetchLogs, POLLING_INTERVAL);
    	});

    	function input_input_handler() {
    		filter = this.value;
    		$$invalidate(0, filter);
    	}

    	return [filter, $logs, input_input_handler];
    }

    class Logs extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$1(this, options, instance$c, create_fragment$c, safe_not_equal, {});
    	}
    }

    var index$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Logs
    });

    /* src\pages\Logs\Modal.svelte generated by Svelte v3.24.1 */

    const { document: document_1 } = globals;

    function add_css() {
    	var style = element("style");
    	style.id = "svelte-11g0cp4-style";
    	style.textContent = ".modal-background.svelte-11g0cp4{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.3)}.modal.svelte-11g0cp4{position:absolute;left:50%;top:50%;width:calc(100vw - 4em);max-width:32em;max-height:calc(100vh - 4em);overflow:auto;transform:translate(-50%,-50%);padding:1em;border-radius:0.2em;background:white}button.svelte-11g0cp4{display:block}";
    	append(document_1.head, style);
    }

    const get_header_slot_changes = dirty => ({});
    const get_header_slot_context = ctx => ({});

    function create_fragment$b(ctx) {
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let hr0;
    	let t2;
    	let t3;
    	let hr1;
    	let t4;
    	let button;
    	let t5;
    	let current;
    	let mounted;
    	let dispose;
    	const header_slot_template = /*$$slots*/ ctx[4].header;
    	const header_slot = create_slot(header_slot_template, ctx, /*$$scope*/ ctx[3], get_header_slot_context);
    	const default_slot_template = /*$$slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	return {
    		c() {
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			if (header_slot) header_slot.c();
    			t1 = space();
    			hr0 = element("hr");
    			t2 = space();
    			if (default_slot) default_slot.c();
    			t3 = space();
    			hr1 = element("hr");
    			t4 = space();
    			button = element("button");
    			t5 = text("close modal");
    			this.h();
    		},
    		l(nodes) {
    			div0 = claim_element(nodes, "DIV", { class: true });
    			children(div0).forEach(detach);
    			t0 = claim_space(nodes);

    			div1 = claim_element(nodes, "DIV", {
    				class: true,
    				role: true,
    				"aria-modal": true
    			});

    			var div1_nodes = children(div1);
    			if (header_slot) header_slot.l(div1_nodes);
    			t1 = claim_space(div1_nodes);
    			hr0 = claim_element(div1_nodes, "HR", {});
    			t2 = claim_space(div1_nodes);
    			if (default_slot) default_slot.l(div1_nodes);
    			t3 = claim_space(div1_nodes);
    			hr1 = claim_element(div1_nodes, "HR", {});
    			t4 = claim_space(div1_nodes);
    			button = claim_element(div1_nodes, "BUTTON", { autofocus: true, class: true });
    			var button_nodes = children(button);
    			t5 = claim_text(button_nodes, "close modal");
    			button_nodes.forEach(detach);
    			div1_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(div0, "class", "modal-background svelte-11g0cp4");
    			button.autofocus = true;
    			attr(button, "class", "svelte-11g0cp4");
    			attr(div1, "class", "modal svelte-11g0cp4");
    			attr(div1, "role", "dialog");
    			attr(div1, "aria-modal", "true");
    		},
    		m(target, anchor) {
    			insert(target, div0, anchor);
    			insert(target, t0, anchor);
    			insert(target, div1, anchor);

    			if (header_slot) {
    				header_slot.m(div1, null);
    			}

    			append(div1, t1);
    			append(div1, hr0);
    			append(div1, t2);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			append(div1, t3);
    			append(div1, hr1);
    			append(div1, t4);
    			append(div1, button);
    			append(button, t5);
    			/*div1_binding*/ ctx[5](div1);
    			current = true;
    			button.focus();

    			if (!mounted) {
    				dispose = [
    					listen(window, "keydown", /*handle_keydown*/ ctx[2]),
    					listen(div0, "click", /*close*/ ctx[1]),
    					listen(button, "click", /*close*/ ctx[1])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (header_slot) {
    				if (header_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(header_slot, header_slot_template, ctx, /*$$scope*/ ctx[3], dirty, get_header_slot_changes, get_header_slot_context);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(header_slot, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(header_slot, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div0);
    			if (detaching) detach(t0);
    			if (detaching) detach(div1);
    			if (header_slot) header_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			/*div1_binding*/ ctx[5](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function instance$b($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();
    	const close = () => dispatch("close");
    	let modal;

    	const handle_keydown = e => {
    		if (e.key === "Escape") {
    			close();
    			return;
    		}

    		if (e.key === "Tab") {
    			// trap focus
    			const nodes = modal.querySelectorAll("*");

    			const tabbable = Array.from(nodes).filter(n => n.tabIndex >= 0);
    			let index = tabbable.indexOf(document.activeElement);
    			if (index === -1 && e.shiftKey) index = 0;
    			index += tabbable.length + (e.shiftKey ? -1 : 1);
    			index %= tabbable.length;
    			tabbable[index].focus();
    			e.preventDefault();
    		}
    	};

    	const previously_focused = typeof document !== "undefined" && document.activeElement;

    	if (previously_focused) {
    		onDestroy(() => {
    			previously_focused.focus();
    		});
    	}

    	let { $$slots = {}, $$scope } = $$props;

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			modal = $$value;
    			$$invalidate(0, modal);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	return [modal, close, handle_keydown, $$scope, $$slots, div1_binding];
    }

    class Modal extends SvelteComponent {
    	constructor(options) {
    		super();
    		if (!document_1.getElementById("svelte-11g0cp4-style")) add_css();
    		init$1(this, options, instance$b, create_fragment$b, safe_not_equal, {});
    	}
    }

    var Modal$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Modal
    });

    /* src\pages\Models\_layout.svelte generated by Svelte v3.24.1 */

    function create_fragment$a(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	return {
    		c() {
    			if (default_slot) default_slot.c();
    		},
    		l(nodes) {
    			if (default_slot) default_slot.l(nodes);
    		},
    		m(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, $$slots];
    }

    class Layout$2 extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$1(this, options, instance$a, create_fragment$a, safe_not_equal, {});
    	}
    }

    var _layout$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Layout$2
    });

    /* src\pages\Models\index.svelte generated by Svelte v3.24.1 */

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i].id;
    	child_ctx[5] = list[i].name;
    	child_ctx[6] = list[i].properties;
    	return child_ctx;
    }

    // (1:0) <script>    import api from "@/lib/api";    import { url }
    function create_catch_block$1(ctx) {
    	return {
    		c: noop,
    		l: noop,
    		m: noop,
    		p: noop,
    		d: noop
    	};
    }

    // (33:6) {:then data}
    function create_then_block$1(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let each_value = /*data*/ ctx[3];
    	const get_key = ctx => /*id*/ ctx[4];

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$4(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
    	}

    	return {
    		c() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l(nodes) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(nodes);
    			}

    			each_1_anchor = empty();
    		},
    		m(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert(target, each_1_anchor, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*$url, getModelSchemas, getProps*/ 7) {
    				const each_value = /*data*/ ctx[3];
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block$4, each_1_anchor, get_each_context$4);
    			}
    		},
    		d(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach(each_1_anchor);
    		}
    	};
    }

    // (34:8) {#each data as { id, name, properties }
    function create_each_block$4(key_1, ctx) {
    	let a;
    	let div;
    	let h1;
    	let t0_value = /*name*/ ctx[5] + "";
    	let t0;
    	let t1;
    	let html_tag;
    	let raw_value = /*getProps*/ ctx[2](/*properties*/ ctx[6]) + "";
    	let t2;
    	let a_href_value;

    	return {
    		key: key_1,
    		first: null,
    		c() {
    			a = element("a");
    			div = element("div");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = space();
    			this.h();
    		},
    		l(nodes) {
    			a = claim_element(nodes, "A", { class: true, href: true });
    			var a_nodes = children(a);
    			div = claim_element(a_nodes, "DIV", { class: true });
    			var div_nodes = children(div);
    			h1 = claim_element(div_nodes, "H1", { class: true });
    			var h1_nodes = children(h1);
    			t0 = claim_text(h1_nodes, t0_value);
    			h1_nodes.forEach(detach);
    			t1 = claim_space(div_nodes);
    			div_nodes.forEach(detach);
    			t2 = claim_space(a_nodes);
    			a_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(h1, "class", "pb-2 mb-2 text-2xl leading-relaxed");
    			html_tag = new HtmlTag(null);
    			attr(div, "class", "relative flex flex-col h-full p-5 bg-gray-200 border border-gray-400 hover:bg-gray-300 hover:shadow-md");
    			attr(a, "class", "");
    			attr(a, "href", a_href_value = /*$url*/ ctx[0]("../Manage/:id", { id: /*id*/ ctx[4] }));
    			this.first = a;
    		},
    		m(target, anchor) {
    			insert(target, a, anchor);
    			append(a, div);
    			append(div, h1);
    			append(h1, t0);
    			append(div, t1);
    			html_tag.m(raw_value, div);
    			append(a, t2);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*$url*/ 1 && a_href_value !== (a_href_value = /*$url*/ ctx[0]("../Manage/:id", { id: /*id*/ ctx[4] }))) {
    				attr(a, "href", a_href_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(a);
    		}
    	};
    }

    // (31:32)           <p>Loading...</p>        {:then data}
    function create_pending_block$1(ctx) {
    	let p;
    	let t;

    	return {
    		c() {
    			p = element("p");
    			t = text("Loading...");
    		},
    		l(nodes) {
    			p = claim_element(nodes, "P", {});
    			var p_nodes = children(p);
    			t = claim_text(p_nodes, "Loading...");
    			p_nodes.forEach(detach);
    		},
    		m(target, anchor) {
    			insert(target, p, anchor);
    			append(p, t);
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(p);
    		}
    	};
    }

    function create_fragment$9(ctx) {
    	let h1;
    	let t0;
    	let t1;
    	let p;
    	let t2;
    	let t3;
    	let section;
    	let div1;
    	let div0;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 3
    	};

    	handle_promise(/*getModelSchemas*/ ctx[1](), info);

    	return {
    		c() {
    			h1 = element("h1");
    			t0 = text("Records");
    			t1 = space();
    			p = element("p");
    			t2 = text("Choose table that you want to see the records for.");
    			t3 = space();
    			section = element("section");
    			div1 = element("div");
    			div0 = element("div");
    			info.block.c();
    			this.h();
    		},
    		l(nodes) {
    			h1 = claim_element(nodes, "H1", { class: true });
    			var h1_nodes = children(h1);
    			t0 = claim_text(h1_nodes, "Records");
    			h1_nodes.forEach(detach);
    			t1 = claim_space(nodes);
    			p = claim_element(nodes, "P", {});
    			var p_nodes = children(p);
    			t2 = claim_text(p_nodes, "Choose table that you want to see the records for.");
    			p_nodes.forEach(detach);
    			t3 = claim_space(nodes);
    			section = claim_element(nodes, "SECTION", { class: true });
    			var section_nodes = children(section);
    			div1 = claim_element(section_nodes, "DIV", { class: true });
    			var div1_nodes = children(div1);
    			div0 = claim_element(div1_nodes, "DIV", { class: true });
    			var div0_nodes = children(div0);
    			info.block.l(div0_nodes);
    			div0_nodes.forEach(detach);
    			div1_nodes.forEach(detach);
    			section_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(h1, "class", "mb-2 text-5xl");
    			attr(div0, "class", "grid gap-5 lg:grid-cols-3 md:grid-cols-2");
    			attr(div1, "class", "container py-8");
    			attr(section, "class", "overflow-hidden");
    		},
    		m(target, anchor) {
    			insert(target, h1, anchor);
    			append(h1, t0);
    			insert(target, t1, anchor);
    			insert(target, p, anchor);
    			append(p, t2);
    			insert(target, t3, anchor);
    			insert(target, section, anchor);
    			append(section, div1);
    			append(div1, div0);
    			info.block.m(div0, info.anchor = null);
    			info.mount = () => div0;
    			info.anchor = null;
    		},
    		p(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			{
    				const child_ctx = ctx.slice();
    				child_ctx[3] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(h1);
    			if (detaching) detach(t1);
    			if (detaching) detach(p);
    			if (detaching) detach(t3);
    			if (detaching) detach(section);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $url;
    	component_subscribe($$self, url, $$value => $$invalidate(0, $url = $$value));
    	const getModelSchemas = async () => await api.getModelSchemas();

    	const getProps = props => {
    		const items = props.map(prop => {
    			return `<li>${prop.name} (${prop.attribute_type})</li>`;
    		}).join("");

    		const list = `
      <ul class="grid grid-cols-2 gap-2 text-sm list-disc list-inside">
        ${items}
      </ul>
    `;

    		return list;
    	};

    	return [$url, getModelSchemas, getProps];
    }

    class Models extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$1(this, options, instance$9, create_fragment$9, safe_not_equal, {});
    	}
    }

    var index$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Models
    });

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function slide(node, { delay = 0, duration = 400, easing = cubicOut }) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => `overflow: hidden;` +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    function getTime(datetime) {
      const dt = new Date(datetime);
      return format(dt, "dd MMM yyyy, HH:mm:ss");
    }

    const createStore = () => {
      const { subscribe, set, update } = writable([]);
      return {
        subscribe,
        set,
        update,
        addModel: (model) => {
          return update((models) => [...models, model]);
        },
        refreshModels: (schemaId, page = 1) => {
          return Promise.all([
            api.getModels({ schemaId, page }),
            api.getModels({ schemaId, deleted: true, page })
          ]).then((results) => {
            set([...results[0], ...results[1]]);
          });
        }
      };
    };
    var modelsStore = createStore();

    /* src\_components\InputField.svelte generated by Svelte v3.24.1 */

    function create_else_block$3(ctx) {
    	let input;
    	let input_value_value;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			input = element("input");
    			this.h();
    		},
    		l(nodes) {
    			input = claim_element(nodes, "INPUT", {
    				class: true,
    				type: true,
    				value: true,
    				placeholder: true,
    				name: true,
    				id: true
    			});

    			this.h();
    		},
    		h() {
    			attr(input, "class", "w-full mr-2 form-input");
    			attr(input, "type", "text");
    			input.value = input_value_value = /*value*/ ctx[2] ? JSON.stringify(/*value*/ ctx[2]) : "";
    			attr(input, "placeholder", /*attribute_type*/ ctx[0]);
    			attr(input, "name", /*name*/ ctx[1]);
    			attr(input, "id", "attr_type");
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);

    			if (!mounted) {
    				dispose = listen(input, "input", /*propagateUpdate*/ ctx[3]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (dirty & /*value*/ 4 && input_value_value !== (input_value_value = /*value*/ ctx[2] ? JSON.stringify(/*value*/ ctx[2]) : "") && input.value !== input_value_value) {
    				input.value = input_value_value;
    			}

    			if (dirty & /*attribute_type*/ 1) {
    				attr(input, "placeholder", /*attribute_type*/ ctx[0]);
    			}

    			if (dirty & /*name*/ 2) {
    				attr(input, "name", /*name*/ ctx[1]);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(input);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (30:2) {#if attribute_type === 'text' || attribute_type === 'upload' || attribute_type === 'array'}
    function create_if_block$4(ctx) {
    	let textarea;
    	let textarea_value_value;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			textarea = element("textarea");
    			this.h();
    		},
    		l(nodes) {
    			textarea = claim_element(nodes, "TEXTAREA", {
    				class: true,
    				rows: true,
    				value: true,
    				placeholder: true,
    				name: true,
    				id: true
    			});

    			children(textarea).forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(textarea, "class", "w-full mr-2 form-input");
    			attr(textarea, "rows", "3");
    			textarea.value = textarea_value_value = JSON.stringify(/*value*/ ctx[2], null, 2);
    			attr(textarea, "placeholder", /*attribute_type*/ ctx[0]);
    			attr(textarea, "name", /*name*/ ctx[1]);
    			attr(textarea, "id", "attr_type");
    		},
    		m(target, anchor) {
    			insert(target, textarea, anchor);

    			if (!mounted) {
    				dispose = listen(textarea, "input", /*propagateUpdate*/ ctx[3]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (dirty & /*value*/ 4 && textarea_value_value !== (textarea_value_value = JSON.stringify(/*value*/ ctx[2], null, 2))) {
    				textarea.value = textarea_value_value;
    			}

    			if (dirty & /*attribute_type*/ 1) {
    				attr(textarea, "placeholder", /*attribute_type*/ ctx[0]);
    			}

    			if (dirty & /*name*/ 2) {
    				attr(textarea, "name", /*name*/ ctx[1]);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(textarea);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function create_fragment$8(ctx) {
    	let label;
    	let span;
    	let t0;
    	let t1;
    	let br;
    	let t2;

    	function select_block_type(ctx, dirty) {
    		if (/*attribute_type*/ ctx[0] === "text" || /*attribute_type*/ ctx[0] === "upload" || /*attribute_type*/ ctx[0] === "array") return create_if_block$4;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	return {
    		c() {
    			label = element("label");
    			span = element("span");
    			t0 = text(/*name*/ ctx[1]);
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			if_block.c();
    			this.h();
    		},
    		l(nodes) {
    			label = claim_element(nodes, "LABEL", { class: true, for: true });
    			var label_nodes = children(label);
    			span = claim_element(label_nodes, "SPAN", { class: true });
    			var span_nodes = children(span);
    			t0 = claim_text(span_nodes, /*name*/ ctx[1]);
    			span_nodes.forEach(detach);
    			t1 = claim_space(label_nodes);
    			br = claim_element(label_nodes, "BR", {});
    			t2 = claim_space(label_nodes);
    			if_block.l(label_nodes);
    			label_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(span, "class", "w-full");
    			attr(label, "class", "block w-10/12");
    			attr(label, "for", "attr_type");
    		},
    		m(target, anchor) {
    			insert(target, label, anchor);
    			append(label, span);
    			append(span, t0);
    			append(label, t1);
    			append(label, br);
    			append(label, t2);
    			if_block.m(label, null);
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*name*/ 2) set_data(t0, /*name*/ ctx[1]);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(label, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(label);
    			if_block.d();
    		}
    	};
    }

    function instance$8($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();
    	let { id } = $$props;
    	let { attribute_type } = $$props;
    	let { name } = $$props;
    	let { value = "" } = $$props;

    	// TODO: Rewrite to store?
    	const propagateUpdate = e => {
    		const data = {
    			id,
    			props: {
    				[name]: {
    					name,
    					value: e.target.value,
    					attribute_type
    				}
    			}
    		};

    		dispatch("formChanged", data);
    	};

    	$$self.$$set = $$props => {
    		if ("id" in $$props) $$invalidate(4, id = $$props.id);
    		if ("attribute_type" in $$props) $$invalidate(0, attribute_type = $$props.attribute_type);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("value" in $$props) $$invalidate(2, value = $$props.value);
    	};

    	return [attribute_type, name, value, propagateUpdate, id];
    }

    class InputField extends SvelteComponent {
    	constructor(options) {
    		super();

    		init$1(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			id: 4,
    			attribute_type: 0,
    			name: 1,
    			value: 2
    		});
    	}
    }

    /* src\_components\NewModelInputField.svelte generated by Svelte v3.24.1 */

    function create_fragment$7(ctx) {
    	let label;
    	let p;
    	let t0;
    	let t1;
    	let span;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let input;
    	let input_placeholder_value;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			label = element("label");
    			p = element("p");
    			t0 = text(/*name*/ ctx[1]);
    			t1 = space();
    			span = element("span");
    			t2 = text("(");
    			t3 = text(/*attribute_type*/ ctx[0]);
    			t4 = text(")");
    			t5 = space();
    			input = element("input");
    			this.h();
    		},
    		l(nodes) {
    			label = claim_element(nodes, "LABEL", { class: true });
    			var label_nodes = children(label);
    			p = claim_element(label_nodes, "P", { class: true });
    			var p_nodes = children(p);
    			t0 = claim_text(p_nodes, /*name*/ ctx[1]);
    			t1 = claim_space(p_nodes);
    			span = claim_element(p_nodes, "SPAN", { class: true });
    			var span_nodes = children(span);
    			t2 = claim_text(span_nodes, "(");
    			t3 = claim_text(span_nodes, /*attribute_type*/ ctx[0]);
    			t4 = claim_text(span_nodes, ")");
    			span_nodes.forEach(detach);
    			p_nodes.forEach(detach);
    			t5 = claim_space(label_nodes);

    			input = claim_element(label_nodes, "INPUT", {
    				class: true,
    				type: true,
    				value: true,
    				placeholder: true
    			});

    			label_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(span, "class", "text-gray-600");
    			attr(p, "class", "w-full mb-2");
    			attr(input, "class", "w-10/12 mr-2 form-input");
    			attr(input, "type", "text");
    			input.value = /*value*/ ctx[2];
    			attr(input, "placeholder", input_placeholder_value = /*getExample*/ ctx[4](/*attribute_type*/ ctx[0]));
    			attr(label, "class", "block w-10/12");
    		},
    		m(target, anchor) {
    			insert(target, label, anchor);
    			append(label, p);
    			append(p, t0);
    			append(p, t1);
    			append(p, span);
    			append(span, t2);
    			append(span, t3);
    			append(span, t4);
    			append(label, t5);
    			append(label, input);

    			if (!mounted) {
    				dispose = listen(input, "input", /*input_handler*/ ctx[6]);
    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*name*/ 2) set_data(t0, /*name*/ ctx[1]);
    			if (dirty & /*attribute_type*/ 1) set_data(t3, /*attribute_type*/ ctx[0]);

    			if (dirty & /*value*/ 4 && input.value !== /*value*/ ctx[2]) {
    				input.value = /*value*/ ctx[2];
    			}

    			if (dirty & /*attribute_type*/ 1 && input_placeholder_value !== (input_placeholder_value = /*getExample*/ ctx[4](/*attribute_type*/ ctx[0]))) {
    				attr(input, "placeholder", input_placeholder_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(label);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { newProps } = $$props;
    	let { attribute_type } = $$props;
    	let { name } = $$props;
    	let { value = "" } = $$props;

    	function setProp({ name, value, attribute_type }) {
    		$$invalidate(5, newProps[name] = { name, value, attribute_type }, newProps);
    	}

    	const getExample = type => {
    		if (type === "string" || type === "text") return "\"my text\"";
    		if (type === "integer") return "1337";
    		if (type === "float") return "13.37";
    		if (type === "array") return "[\"my\", \"array\", 10]";
    		if (type === "boolean") return "true";
    		if (type === "datetime") return "\"2019-04-03T00:00:00.000Z\"";
    	};

    	const input_handler = e => {
    		setProp({
    			name,
    			value: e.target.value,
    			attribute_type
    		});
    	};

    	$$self.$$set = $$props => {
    		if ("newProps" in $$props) $$invalidate(5, newProps = $$props.newProps);
    		if ("attribute_type" in $$props) $$invalidate(0, attribute_type = $$props.attribute_type);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("value" in $$props) $$invalidate(2, value = $$props.value);
    	};

    	return [attribute_type, name, value, setProp, getExample, newProps, input_handler];
    }

    class NewModelInputField extends SvelteComponent {
    	constructor(options) {
    		super();

    		init$1(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			newProps: 5,
    			attribute_type: 0,
    			name: 1,
    			value: 2
    		});
    	}
    }

    /* src\pages\Models\Manage\_new.svelte generated by Svelte v3.24.1 */

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i].name;
    	child_ctx[10] = list[i].attribute_type;
    	child_ctx[12] = i;
    	return child_ctx;
    }

    // (29:20) {:else}
    function create_else_block$2(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("+");
    		},
    		l(nodes) {
    			t = claim_text(nodes, "+");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (29:2) {#if showNewForm}
    function create_if_block_1$1(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("-");
    		},
    		l(nodes) {
    			t = claim_text(nodes, "-");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (32:0) {#if showNewForm}
    function create_if_block$3(ctx) {
    	let form;
    	let t0;
    	let br;
    	let t1;
    	let div;
    	let button0;
    	let t2;
    	let t3;
    	let button1;
    	let t4;
    	let form_intro;
    	let form_outro;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*props*/ ctx[0];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	return {
    		c() {
    			form = element("form");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			br = element("br");
    			t1 = space();
    			div = element("div");
    			button0 = element("button");
    			t2 = text("Create");
    			t3 = space();
    			button1 = element("button");
    			t4 = text("Cancel");
    			this.h();
    		},
    		l(nodes) {
    			form = claim_element(nodes, "FORM", { class: true });
    			var form_nodes = children(form);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(form_nodes);
    			}

    			t0 = claim_space(form_nodes);
    			br = claim_element(form_nodes, "BR", {});
    			t1 = claim_space(form_nodes);
    			div = claim_element(form_nodes, "DIV", { class: true });
    			var div_nodes = children(div);
    			button0 = claim_element(div_nodes, "BUTTON", { class: true });
    			var button0_nodes = children(button0);
    			t2 = claim_text(button0_nodes, "Create");
    			button0_nodes.forEach(detach);
    			t3 = claim_space(div_nodes);
    			button1 = claim_element(div_nodes, "BUTTON", { type: true, class: true });
    			var button1_nodes = children(button1);
    			t4 = claim_text(button1_nodes, "Cancel");
    			button1_nodes.forEach(detach);
    			div_nodes.forEach(detach);
    			form_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(button0, "class", "button");
    			attr(button1, "type", "button");
    			attr(button1, "class", "ml-4 button link");
    			attr(div, "class", "flex w-full mt-4");
    			attr(form, "class", "flex flex-wrap p-6 mb-4 border border-blue-500 rounded");
    		},
    		m(target, anchor) {
    			insert(target, form, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(form, null);
    			}

    			append(form, t0);
    			append(form, br);
    			append(form, t1);
    			append(form, div);
    			append(div, button0);
    			append(button0, t2);
    			append(div, t3);
    			append(div, button1);
    			append(button1, t4);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(button1, "click", /*click_handler_1*/ ctx[8]),
    					listen(form, "submit", prevent_default(/*handleSubmit*/ ctx[3]))
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (dirty & /*props, newProps*/ 5) {
    				each_value = /*props*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(form, t0);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			add_render_callback(() => {
    				if (form_outro) form_outro.end(1);
    				if (!form_intro) form_intro = create_in_transition(form, slide, {});
    				form_intro.start();
    			});

    			current = true;
    		},
    		o(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			if (form_intro) form_intro.invalidate();
    			form_outro = create_out_transition(form, slide, {});
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(form);
    			destroy_each(each_blocks, detaching);
    			if (detaching && form_outro) form_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (35:4) {#each props as { name, attribute_type }
    function create_each_block$3(ctx) {
    	let div;
    	let newmodelinputfield;
    	let updating_newProps;
    	let current;

    	function newmodelinputfield_newProps_binding(value) {
    		/*newmodelinputfield_newProps_binding*/ ctx[7].call(null, value);
    	}

    	let newmodelinputfield_props = {
    		attribute_type: /*attribute_type*/ ctx[10],
    		name: /*name*/ ctx[9],
    		value: "",
    		placeholder: /*attribute_type*/ ctx[10]
    	};

    	if (/*newProps*/ ctx[2] !== void 0) {
    		newmodelinputfield_props.newProps = /*newProps*/ ctx[2];
    	}

    	newmodelinputfield = new NewModelInputField({ props: newmodelinputfield_props });
    	binding_callbacks.push(() => bind(newmodelinputfield, "newProps", newmodelinputfield_newProps_binding));

    	return {
    		c() {
    			div = element("div");
    			create_component(newmodelinputfield.$$.fragment);
    			this.h();
    		},
    		l(nodes) {
    			div = claim_element(nodes, "DIV", { class: true });
    			var div_nodes = children(div);
    			claim_component(newmodelinputfield.$$.fragment, div_nodes);
    			div_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(div, "class", "w-5/12 mb-2 mr-4");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			mount_component(newmodelinputfield, div, null);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const newmodelinputfield_changes = {};
    			if (dirty & /*props*/ 1) newmodelinputfield_changes.attribute_type = /*attribute_type*/ ctx[10];
    			if (dirty & /*props*/ 1) newmodelinputfield_changes.name = /*name*/ ctx[9];
    			if (dirty & /*props*/ 1) newmodelinputfield_changes.placeholder = /*attribute_type*/ ctx[10];

    			if (!updating_newProps && dirty & /*newProps*/ 4) {
    				updating_newProps = true;
    				newmodelinputfield_changes.newProps = /*newProps*/ ctx[2];
    				add_flush_callback(() => updating_newProps = false);
    			}

    			newmodelinputfield.$set(newmodelinputfield_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(newmodelinputfield.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(newmodelinputfield.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			destroy_component(newmodelinputfield);
    		}
    	};
    }

    function create_fragment$6(ctx) {
    	let button;
    	let t0;
    	let t1;
    	let if_block1_anchor;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*showNewForm*/ ctx[1]) return create_if_block_1$1;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*showNewForm*/ ctx[1] && create_if_block$3(ctx);

    	return {
    		c() {
    			button = element("button");
    			if_block0.c();
    			t0 = text(" New record");
    			t1 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			this.h();
    		},
    		l(nodes) {
    			button = claim_element(nodes, "BUTTON", { class: true });
    			var button_nodes = children(button);
    			if_block0.l(button_nodes);
    			t0 = claim_text(button_nodes, " New record");
    			button_nodes.forEach(detach);
    			t1 = claim_space(nodes);
    			if (if_block1) if_block1.l(nodes);
    			if_block1_anchor = empty();
    			this.h();
    		},
    		h() {
    			attr(button, "class", "my-4 ml-auto button");
    		},
    		m(target, anchor) {
    			insert(target, button, anchor);
    			if_block0.m(button, null);
    			append(button, t0);
    			insert(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert(target, if_block1_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen(button, "click", /*click_handler*/ ctx[6]);
    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(button, t0);
    				}
    			}

    			if (/*showNewForm*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*showNewForm*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(button);
    			if_block0.d();
    			if (detaching) detach(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach(if_block1_anchor);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let showNewForm = false;
    	let { schemaId } = $$props;
    	let { schemaName } = $$props;
    	let { props } = $$props;
    	let newProps = {};

    	const handleSubmit = () => {
    		api.createModel(schemaName, newProps).then(data => {
    			if (data) {
    				modelsStore.refreshModels(schemaId);
    				$$invalidate(1, showNewForm = false);
    			}
    		});
    	};

    	const click_handler = () => $$invalidate(1, showNewForm = !showNewForm);

    	function newmodelinputfield_newProps_binding(value) {
    		newProps = value;
    		$$invalidate(2, newProps);
    	}

    	const click_handler_1 = () => $$invalidate(1, showNewForm = !showNewForm);

    	$$self.$$set = $$props => {
    		if ("schemaId" in $$props) $$invalidate(4, schemaId = $$props.schemaId);
    		if ("schemaName" in $$props) $$invalidate(5, schemaName = $$props.schemaName);
    		if ("props" in $$props) $$invalidate(0, props = $$props.props);
    	};

    	return [
    		props,
    		showNewForm,
    		newProps,
    		handleSubmit,
    		schemaId,
    		schemaName,
    		click_handler,
    		newmodelinputfield_newProps_binding,
    		click_handler_1
    	];
    }

    class New extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$1(this, options, instance$6, create_fragment$6, safe_not_equal, { schemaId: 4, schemaName: 5, props: 0 });
    	}
    }

    /* src\pages\Models\Manage\_filter.svelte generated by Svelte v3.24.1 */

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	child_ctx[16] = i;
    	return child_ctx;
    }

    // (52:18) {:else}
    function create_else_block$1(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("+");
    		},
    		l(nodes) {
    			t = claim_text(nodes, "+");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (52:0) {#if showFilters}
    function create_if_block_5(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("-");
    		},
    		l(nodes) {
    			t = claim_text(nodes, "-");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (55:0) {#if showFilters}
    function create_if_block$2(ctx) {
    	let form;
    	let select0;
    	let option0;
    	let t0;
    	let t1;
    	let select1;
    	let option1;
    	let t2;
    	let option2;
    	let t3;
    	let option3;
    	let t4;
    	let option4;
    	let t5;
    	let if_block0_anchor;
    	let if_block1_anchor;
    	let t6;
    	let input;
    	let input_value_value;
    	let t7;
    	let show_if = /*showValueField*/ ctx[6](/*selectedOperation*/ ctx[2], /*selectedProperty*/ ctx[3]);
    	let t8;
    	let br;
    	let t9;
    	let div;
    	let button0;
    	let t10;
    	let t11;
    	let button1;
    	let t12;
    	let form_intro;
    	let form_outro;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*props*/ ctx[0];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	let if_block0 = (/*selectedProperty*/ ctx[3].attribute_type === "string" || /*selectedProperty*/ ctx[3].attribute_type === "text") && create_if_block_4();
    	let if_block1 = (/*selectedProperty*/ ctx[3].attribute_type === "integer" || /*selectedProperty*/ ctx[3].attribute_type === "float") && create_if_block_3();
    	let if_block2 = /*selectedProperty*/ ctx[3].attribute_type === "array" && create_if_block_2();
    	let if_block3 = show_if && create_if_block_1(ctx);

    	return {
    		c() {
    			form = element("form");
    			select0 = element("select");
    			option0 = element("option");
    			t0 = text("Choose property");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			select1 = element("select");
    			option1 = element("option");
    			t2 = text("Choose filter type");
    			option2 = element("option");
    			t3 = text("contains");
    			option3 = element("option");
    			t4 = text("exists");
    			option4 = element("option");
    			t5 = text("not contains");
    			if (if_block0) if_block0.c();
    			if_block0_anchor = empty();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			if (if_block2) if_block2.c();
    			t6 = space();
    			input = element("input");
    			t7 = space();
    			if (if_block3) if_block3.c();
    			t8 = space();
    			br = element("br");
    			t9 = space();
    			div = element("div");
    			button0 = element("button");
    			t10 = text("Filter");
    			t11 = space();
    			button1 = element("button");
    			t12 = text("Cancel");
    			this.h();
    		},
    		l(nodes) {
    			form = claim_element(nodes, "FORM", { class: true });
    			var form_nodes = children(form);
    			select0 = claim_element(form_nodes, "SELECT", { name: true, class: true, required: true });
    			var select0_nodes = children(select0);
    			option0 = claim_element(select0_nodes, "OPTION", { value: true, class: true });
    			var option0_nodes = children(option0);
    			t0 = claim_text(option0_nodes, "Choose property");
    			option0_nodes.forEach(detach);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(select0_nodes);
    			}

    			select0_nodes.forEach(detach);
    			t1 = claim_space(form_nodes);
    			select1 = claim_element(form_nodes, "SELECT", { name: true, class: true, required: true });
    			var select1_nodes = children(select1);
    			option1 = claim_element(select1_nodes, "OPTION", { value: true, class: true });
    			var option1_nodes = children(option1);
    			t2 = claim_text(option1_nodes, "Choose filter type");
    			option1_nodes.forEach(detach);
    			option2 = claim_element(select1_nodes, "OPTION", { value: true });
    			var option2_nodes = children(option2);
    			t3 = claim_text(option2_nodes, "contains");
    			option2_nodes.forEach(detach);
    			option3 = claim_element(select1_nodes, "OPTION", { value: true });
    			var option3_nodes = children(option3);
    			t4 = claim_text(option3_nodes, "exists");
    			option3_nodes.forEach(detach);
    			option4 = claim_element(select1_nodes, "OPTION", { value: true });
    			var option4_nodes = children(option4);
    			t5 = claim_text(option4_nodes, "not contains");
    			option4_nodes.forEach(detach);
    			if (if_block0) if_block0.l(select1_nodes);
    			if_block0_anchor = empty();
    			if (if_block1) if_block1.l(select1_nodes);
    			if_block1_anchor = empty();
    			if (if_block2) if_block2.l(select1_nodes);
    			select1_nodes.forEach(detach);
    			t6 = claim_space(form_nodes);
    			input = claim_element(form_nodes, "INPUT", { type: true, name: true, value: true });
    			t7 = claim_space(form_nodes);
    			if (if_block3) if_block3.l(form_nodes);
    			t8 = claim_space(form_nodes);
    			br = claim_element(form_nodes, "BR", {});
    			t9 = claim_space(form_nodes);
    			div = claim_element(form_nodes, "DIV", { class: true });
    			var div_nodes = children(div);
    			button0 = claim_element(div_nodes, "BUTTON", { class: true });
    			var button0_nodes = children(button0);
    			t10 = claim_text(button0_nodes, "Filter");
    			button0_nodes.forEach(detach);
    			t11 = claim_space(div_nodes);
    			button1 = claim_element(div_nodes, "BUTTON", { type: true, class: true });
    			var button1_nodes = children(button1);
    			t12 = claim_text(button1_nodes, "Cancel");
    			button1_nodes.forEach(detach);
    			div_nodes.forEach(detach);
    			form_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			option0.__value = "";
    			option0.value = option0.__value;
    			attr(option0, "class", "text-gray-500");
    			attr(select0, "name", "property");
    			attr(select0, "class", "mr-4 form-select");
    			select0.required = true;
    			if (/*selectedProperty*/ ctx[3] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[10].call(select0));
    			option1.__value = "";
    			option1.value = option1.__value;
    			attr(option1, "class", "text-gray-500");
    			option2.__value = "contains";
    			option2.value = option2.__value;
    			option3.__value = "exists";
    			option3.value = option3.__value;
    			option4.__value = "not_contains";
    			option4.value = option4.__value;
    			attr(select1, "name", "operation");
    			attr(select1, "class", "mr-2 form-select");
    			select1.required = true;
    			if (/*selectedOperation*/ ctx[2] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[12].call(select1));
    			attr(input, "type", "hidden");
    			attr(input, "name", "type");
    			input.value = input_value_value = /*getPropType*/ ctx[5](/*props*/ ctx[0], /*selectedProperty*/ ctx[3]);
    			attr(button0, "class", "button");
    			attr(button1, "type", "button");
    			attr(button1, "class", "ml-4 button link");
    			attr(div, "class", "flex w-full mt-4");
    			attr(form, "class", "flex flex-wrap items-center p-6 mb-4 border border-blue-500 rounded");
    		},
    		m(target, anchor) {
    			insert(target, form, anchor);
    			append(form, select0);
    			append(select0, option0);
    			append(option0, t0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select0, null);
    			}

    			select_option(select0, /*selectedProperty*/ ctx[3]);
    			append(form, t1);
    			append(form, select1);
    			append(select1, option1);
    			append(option1, t2);
    			append(select1, option2);
    			append(option2, t3);
    			append(select1, option3);
    			append(option3, t4);
    			append(select1, option4);
    			append(option4, t5);
    			if (if_block0) if_block0.m(select1, null);
    			append(select1, if_block0_anchor);
    			if (if_block1) if_block1.m(select1, null);
    			append(select1, if_block1_anchor);
    			if (if_block2) if_block2.m(select1, null);
    			select_option(select1, /*selectedOperation*/ ctx[2]);
    			append(form, t6);
    			append(form, input);
    			append(form, t7);
    			if (if_block3) if_block3.m(form, null);
    			append(form, t8);
    			append(form, br);
    			append(form, t9);
    			append(form, div);
    			append(div, button0);
    			append(button0, t10);
    			append(div, t11);
    			append(div, button1);
    			append(button1, t12);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(select0, "change", /*select0_change_handler*/ ctx[10]),
    					listen(select0, "blur", /*blur_handler*/ ctx[11]),
    					listen(select1, "change", /*select1_change_handler*/ ctx[12]),
    					listen(button1, "click", /*click_handler_1*/ ctx[13]),
    					listen(form, "submit", prevent_default(/*handleSubmit*/ ctx[4]))
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (dirty & /*props*/ 1) {
    				each_value = /*props*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*selectedProperty, props*/ 9) {
    				select_option(select0, /*selectedProperty*/ ctx[3]);
    			}

    			if (/*selectedProperty*/ ctx[3].attribute_type === "string" || /*selectedProperty*/ ctx[3].attribute_type === "text") {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_4();
    					if_block0.c();
    					if_block0.m(select1, if_block0_anchor);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*selectedProperty*/ ctx[3].attribute_type === "integer" || /*selectedProperty*/ ctx[3].attribute_type === "float") {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_3();
    					if_block1.c();
    					if_block1.m(select1, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*selectedProperty*/ ctx[3].attribute_type === "array") {
    				if (if_block2) ; else {
    					if_block2 = create_if_block_2();
    					if_block2.c();
    					if_block2.m(select1, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty & /*selectedOperation*/ 4) {
    				select_option(select1, /*selectedOperation*/ ctx[2]);
    			}

    			if (!current || dirty & /*props, selectedProperty*/ 9 && input_value_value !== (input_value_value = /*getPropType*/ ctx[5](/*props*/ ctx[0], /*selectedProperty*/ ctx[3]))) {
    				input.value = input_value_value;
    			}

    			if (dirty & /*selectedOperation, selectedProperty*/ 12) show_if = /*showValueField*/ ctx[6](/*selectedOperation*/ ctx[2], /*selectedProperty*/ ctx[3]);

    			if (show_if) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_1(ctx);
    					if_block3.c();
    					if_block3.m(form, t8);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}
    		},
    		i(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (form_outro) form_outro.end(1);
    				if (!form_intro) form_intro = create_in_transition(form, slide, {});
    				form_intro.start();
    			});

    			current = true;
    		},
    		o(local) {
    			if (form_intro) form_intro.invalidate();
    			form_outro = create_out_transition(form, slide, {});
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(form);
    			destroy_each(each_blocks, detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (detaching && form_outro) form_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (65:6) {#each props as prop, i}
    function create_each_block$2(ctx) {
    	let option;
    	let t0_value = /*prop*/ ctx[14].name + "";
    	let t0;
    	let t1;
    	let t2_value = /*prop*/ ctx[14].attribute_type + "";
    	let t2;
    	let t3;
    	let option_value_value;

    	return {
    		c() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = text(" (");
    			t2 = text(t2_value);
    			t3 = text(")");
    			this.h();
    		},
    		l(nodes) {
    			option = claim_element(nodes, "OPTION", { value: true });
    			var option_nodes = children(option);
    			t0 = claim_text(option_nodes, t0_value);
    			t1 = claim_text(option_nodes, " (");
    			t2 = claim_text(option_nodes, t2_value);
    			t3 = claim_text(option_nodes, ")");
    			option_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			option.__value = option_value_value = /*prop*/ ctx[14].name;
    			option.value = option.__value;
    		},
    		m(target, anchor) {
    			insert(target, option, anchor);
    			append(option, t0);
    			append(option, t1);
    			append(option, t2);
    			append(option, t3);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*props*/ 1 && t0_value !== (t0_value = /*prop*/ ctx[14].name + "")) set_data(t0, t0_value);
    			if (dirty & /*props*/ 1 && t2_value !== (t2_value = /*prop*/ ctx[14].attribute_type + "")) set_data(t2, t2_value);

    			if (dirty & /*props*/ 1 && option_value_value !== (option_value_value = /*prop*/ ctx[14].name)) {
    				option.__value = option_value_value;
    				option.value = option.__value;
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(option);
    		}
    	};
    }

    // (77:6) {#if selectedProperty.attribute_type === 'string' || selectedProperty.attribute_type === 'text'}
    function create_if_block_4(ctx) {
    	let option0;
    	let t0;
    	let option1;
    	let t1;
    	let option2;
    	let t2;
    	let option3;
    	let t3;

    	return {
    		c() {
    			option0 = element("option");
    			t0 = text("ends with");
    			option1 = element("option");
    			t1 = text("starts with");
    			option2 = element("option");
    			t2 = text("not ends with");
    			option3 = element("option");
    			t3 = text("not starts with");
    			this.h();
    		},
    		l(nodes) {
    			option0 = claim_element(nodes, "OPTION", { value: true });
    			var option0_nodes = children(option0);
    			t0 = claim_text(option0_nodes, "ends with");
    			option0_nodes.forEach(detach);
    			option1 = claim_element(nodes, "OPTION", { value: true });
    			var option1_nodes = children(option1);
    			t1 = claim_text(option1_nodes, "starts with");
    			option1_nodes.forEach(detach);
    			option2 = claim_element(nodes, "OPTION", { value: true });
    			var option2_nodes = children(option2);
    			t2 = claim_text(option2_nodes, "not ends with");
    			option2_nodes.forEach(detach);
    			option3 = claim_element(nodes, "OPTION", { value: true });
    			var option3_nodes = children(option3);
    			t3 = claim_text(option3_nodes, "not starts with");
    			option3_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			option0.__value = "ends_with";
    			option0.value = option0.__value;
    			option1.__value = "starts_with";
    			option1.value = option1.__value;
    			option2.__value = "not_ends_with";
    			option2.value = option2.__value;
    			option3.__value = "not_starts_with";
    			option3.value = option3.__value;
    		},
    		m(target, anchor) {
    			insert(target, option0, anchor);
    			append(option0, t0);
    			insert(target, option1, anchor);
    			append(option1, t1);
    			insert(target, option2, anchor);
    			append(option2, t2);
    			insert(target, option3, anchor);
    			append(option3, t3);
    		},
    		d(detaching) {
    			if (detaching) detach(option0);
    			if (detaching) detach(option1);
    			if (detaching) detach(option2);
    			if (detaching) detach(option3);
    		}
    	};
    }

    // (84:6) {#if selectedProperty.attribute_type === 'integer' || selectedProperty.attribute_type === 'float'}
    function create_if_block_3(ctx) {
    	let option;
    	let t;

    	return {
    		c() {
    			option = element("option");
    			t = text("range");
    			this.h();
    		},
    		l(nodes) {
    			option = claim_element(nodes, "OPTION", { value: true });
    			var option_nodes = children(option);
    			t = claim_text(option_nodes, "range");
    			option_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			option.__value = "range";
    			option.value = option.__value;
    		},
    		m(target, anchor) {
    			insert(target, option, anchor);
    			append(option, t);
    		},
    		d(detaching) {
    			if (detaching) detach(option);
    		}
    	};
    }

    // (88:6) {#if selectedProperty.attribute_type === 'array'}
    function create_if_block_2(ctx) {
    	let option0;
    	let t0;
    	let option1;
    	let t1;

    	return {
    		c() {
    			option0 = element("option");
    			t0 = text("value in");
    			option1 = element("option");
    			t1 = text("not value in");
    			this.h();
    		},
    		l(nodes) {
    			option0 = claim_element(nodes, "OPTION", { value: true });
    			var option0_nodes = children(option0);
    			t0 = claim_text(option0_nodes, "value in");
    			option0_nodes.forEach(detach);
    			option1 = claim_element(nodes, "OPTION", { value: true });
    			var option1_nodes = children(option1);
    			t1 = claim_text(option1_nodes, "not value in");
    			option1_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			option0.__value = "value_in";
    			option0.value = option0.__value;
    			option1.__value = "not_value_in";
    			option1.value = option1.__value;
    		},
    		m(target, anchor) {
    			insert(target, option0, anchor);
    			append(option0, t0);
    			insert(target, option1, anchor);
    			append(option1, t1);
    		},
    		d(detaching) {
    			if (detaching) detach(option0);
    			if (detaching) detach(option1);
    		}
    	};
    }

    // (96:4) {#if showValueField(selectedOperation, selectedProperty)}
    function create_if_block_1(ctx) {
    	let input;
    	let t0;
    	let p;
    	let t1;
    	let t2_value = /*getHint*/ ctx[7](/*selectedOperation*/ ctx[2]) + "";
    	let t2;

    	return {
    		c() {
    			input = element("input");
    			t0 = space();
    			p = element("p");
    			t1 = text("Example: ");
    			t2 = text(t2_value);
    			this.h();
    		},
    		l(nodes) {
    			input = claim_element(nodes, "INPUT", { type: true, name: true, class: true });
    			t0 = claim_space(nodes);
    			p = claim_element(nodes, "P", { class: true });
    			var p_nodes = children(p);
    			t1 = claim_text(p_nodes, "Example: ");
    			t2 = claim_text(p_nodes, t2_value);
    			p_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(input, "type", "text");
    			attr(input, "name", "value");
    			attr(input, "class", "w-64 form-input");
    			attr(p, "class", "ml-4 text-gray-600");
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			insert(target, t0, anchor);
    			insert(target, p, anchor);
    			append(p, t1);
    			append(p, t2);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*selectedOperation*/ 4 && t2_value !== (t2_value = /*getHint*/ ctx[7](/*selectedOperation*/ ctx[2]) + "")) set_data(t2, t2_value);
    		},
    		d(detaching) {
    			if (detaching) detach(input);
    			if (detaching) detach(t0);
    			if (detaching) detach(p);
    		}
    	};
    }

    function create_fragment$5(ctx) {
    	let button;
    	let t0;
    	let t1;
    	let if_block1_anchor;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*showFilters*/ ctx[1]) return create_if_block_5;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*showFilters*/ ctx[1] && create_if_block$2(ctx);

    	return {
    		c() {
    			button = element("button");
    			if_block0.c();
    			t0 = text(" Filter");
    			t1 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			this.h();
    		},
    		l(nodes) {
    			button = claim_element(nodes, "BUTTON", { class: true });
    			var button_nodes = children(button);
    			if_block0.l(button_nodes);
    			t0 = claim_text(button_nodes, " Filter");
    			button_nodes.forEach(detach);
    			t1 = claim_space(nodes);
    			if (if_block1) if_block1.l(nodes);
    			if_block1_anchor = empty();
    			this.h();
    		},
    		h() {
    			attr(button, "class", "my-4 ml-auto button");
    		},
    		m(target, anchor) {
    			insert(target, button, anchor);
    			if_block0.m(button, null);
    			append(button, t0);
    			insert(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert(target, if_block1_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen(button, "click", /*click_handler*/ ctx[9]);
    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(button, t0);
    				}
    			}

    			if (/*showFilters*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*showFilters*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(button);
    			if_block0.d();
    			if (detaching) detach(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach(if_block1_anchor);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { props } = $$props;
    	let { schemaId } = $$props;
    	let showFilters = false;
    	let selectedOperation = "";
    	let selectedProperty = "";

    	const handleSubmit = evt => {
    		const form = evt.target;
    		const fd = new FormData(form);
    		const filters = Object.fromEntries(fd);
    		filtersStore.set(filters);
    		modelsStore.refreshModels(schemaId);
    	};

    	const getPropType = (props, name) => {
    		const prop = props.find(prop => prop.name === name);

    		if (prop) {
    			return prop.attribute_type;
    		}
    	};

    	const showValueField = (op, { attribute_type: type }) => {
    		if (op === "value-in" || op === "value-not-in") {
    			if (type === "array") return true;
    			return false;
    		}

    		return true;
    	};

    	const getHint = op => {
    		if (op === "range") return "{ gt: \"10\", lt: \"20\" } - remember about JSON format and double quotes";
    		if (op === "value_in" || op === "not_value_in") return "[10, \"platformOS\", 30] - remember about square brackets and double quotes";
    		if (op === "ends_with" || op === "not-ends-with") return "\"platformOS\" - remember about double quotes";
    		if (op === "starts_with" || op === "not-starts-with") return "\"platformOS\" - remember about double quotes";
    		if (op === "exists" || op === "not-starts-with") return "true - booleans are NOT inside quotes";
    		return "\"platformOS\" - remember about double quotes";
    	};

    	const click_handler = () => $$invalidate(1, showFilters = !showFilters);

    	function select0_change_handler() {
    		selectedProperty = select_value(this);
    		$$invalidate(3, selectedProperty);
    		$$invalidate(0, props);
    	}

    	const blur_handler = () => $$invalidate(2, selectedOperation = undefined);

    	function select1_change_handler() {
    		selectedOperation = select_value(this);
    		$$invalidate(2, selectedOperation);
    	}

    	const click_handler_1 = () => {
    		filtersStore.reset();
    		$$invalidate(1, showFilters = false);
    	};

    	$$self.$$set = $$props => {
    		if ("props" in $$props) $$invalidate(0, props = $$props.props);
    		if ("schemaId" in $$props) $$invalidate(8, schemaId = $$props.schemaId);
    	};

    	return [
    		props,
    		showFilters,
    		selectedOperation,
    		selectedProperty,
    		handleSubmit,
    		getPropType,
    		showValueField,
    		getHint,
    		schemaId,
    		click_handler,
    		select0_change_handler,
    		blur_handler,
    		select1_change_handler,
    		click_handler_1
    	];
    }

    class Filter extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$1(this, options, instance$5, create_fragment$5, safe_not_equal, { props: 0, schemaId: 8 });
    	}
    }

    /* src\pages\Models\Manage\_pagination.svelte generated by Svelte v3.24.1 */

    function create_fragment$4(ctx) {
    	let ul;
    	let li0;
    	let button0;
    	let t0;
    	let t1;
    	let li1;
    	let t2;
    	let t3_value = /*$pageStore*/ ctx[0].total_pages + "";
    	let t3;
    	let t4;
    	let li2;
    	let t5;
    	let t6_value = /*$pageStore*/ ctx[0].page + "";
    	let t6;
    	let t7;
    	let li3;
    	let button1;
    	let t8;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			ul = element("ul");
    			li0 = element("li");
    			button0 = element("button");
    			t0 = text("Previous page");
    			t1 = space();
    			li1 = element("li");
    			t2 = text("Total Pages: ");
    			t3 = text(t3_value);
    			t4 = space();
    			li2 = element("li");
    			t5 = text("Current page: ");
    			t6 = text(t6_value);
    			t7 = space();
    			li3 = element("li");
    			button1 = element("button");
    			t8 = text("Next page");
    			this.h();
    		},
    		l(nodes) {
    			ul = claim_element(nodes, "UL", { class: true });
    			var ul_nodes = children(ul);
    			li0 = claim_element(ul_nodes, "LI", {});
    			var li0_nodes = children(li0);
    			button0 = claim_element(li0_nodes, "BUTTON", { class: true });
    			var button0_nodes = children(button0);
    			t0 = claim_text(button0_nodes, "Previous page");
    			button0_nodes.forEach(detach);
    			li0_nodes.forEach(detach);
    			t1 = claim_space(ul_nodes);
    			li1 = claim_element(ul_nodes, "LI", {});
    			var li1_nodes = children(li1);
    			t2 = claim_text(li1_nodes, "Total Pages: ");
    			t3 = claim_text(li1_nodes, t3_value);
    			li1_nodes.forEach(detach);
    			t4 = claim_space(ul_nodes);
    			li2 = claim_element(ul_nodes, "LI", {});
    			var li2_nodes = children(li2);
    			t5 = claim_text(li2_nodes, "Current page: ");
    			t6 = claim_text(li2_nodes, t6_value);
    			li2_nodes.forEach(detach);
    			t7 = claim_space(ul_nodes);
    			li3 = claim_element(ul_nodes, "LI", {});
    			var li3_nodes = children(li3);
    			button1 = claim_element(li3_nodes, "BUTTON", { class: true });
    			var button1_nodes = children(button1);
    			t8 = claim_text(button1_nodes, "Next page");
    			button1_nodes.forEach(detach);
    			li3_nodes.forEach(detach);
    			ul_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(button0, "class", "button secondary");
    			attr(button1, "class", "button secondary");
    			attr(ul, "class", "flex justify-between");
    		},
    		m(target, anchor) {
    			insert(target, ul, anchor);
    			append(ul, li0);
    			append(li0, button0);
    			append(button0, t0);
    			append(ul, t1);
    			append(ul, li1);
    			append(li1, t2);
    			append(li1, t3);
    			append(ul, t4);
    			append(ul, li2);
    			append(li2, t5);
    			append(li2, t6);
    			append(ul, t7);
    			append(ul, li3);
    			append(li3, button1);
    			append(button1, t8);

    			if (!mounted) {
    				dispose = [
    					listen(button0, "click", /*decrementPage*/ ctx[2]),
    					listen(button1, "click", /*incrementPage*/ ctx[1])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*$pageStore*/ 1 && t3_value !== (t3_value = /*$pageStore*/ ctx[0].total_pages + "")) set_data(t3, t3_value);
    			if (dirty & /*$pageStore*/ 1 && t6_value !== (t6_value = /*$pageStore*/ ctx[0].page + "")) set_data(t6, t6_value);
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(ul);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $pageStore;
    	component_subscribe($$self, pageStore, $$value => $$invalidate(0, $pageStore = $$value));

    	const incrementPage = () => {
    		pageStore.increment();
    		const ps = get_store_value(pageStore);
    		modelsStore.refreshModels(ps.schemaId, ps.page);
    	};

    	const decrementPage = () => {
    		pageStore.decrement();
    		const ps = get_store_value(pageStore);
    		modelsStore.refreshModels(ps.schemaId, ps.page);
    	};

    	return [$pageStore, incrementPage, decrementPage];
    }

    class Pagination extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$1(this, options, instance$4, create_fragment$4, safe_not_equal, {});
    	}
    }

    /* src\pages\Models\Manage\[id].svelte generated by Svelte v3.24.1 */

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i].name;
    	child_ctx[25] = list[i].attribute_type;
    	child_ctx[23] = i;
    	return child_ctx;
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i].id;
    	child_ctx[18] = list[i].created_at;
    	child_ctx[19] = list[i].updated_at;
    	child_ctx[20] = list[i].deleted_at;
    	child_ctx[21] = list[i].properties;
    	child_ctx[23] = i;
    	return child_ctx;
    }

    // (114:12) {#each props as { name, attribute_type }
    function create_each_block_1(ctx) {
    	let div;
    	let inputfield;
    	let current;

    	inputfield = new InputField({
    			props: {
    				attribute_type: /*attribute_type*/ ctx[25],
    				name: /*name*/ ctx[24],
    				id: /*id*/ ctx[17],
    				value: /*properties*/ ctx[21][/*name*/ ctx[24]]
    			}
    		});

    	inputfield.$on("formChanged", /*handleFormChanged*/ ctx[6]);

    	return {
    		c() {
    			div = element("div");
    			create_component(inputfield.$$.fragment);
    			this.h();
    		},
    		l(nodes) {
    			div = claim_element(nodes, "DIV", { class: true });
    			var div_nodes = children(div);
    			claim_component(inputfield.$$.fragment, div_nodes);
    			div_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(div, "class", "w-5/12 mb-3 mr-4");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			mount_component(inputfield, div, null);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const inputfield_changes = {};
    			if (dirty & /*props*/ 8) inputfield_changes.attribute_type = /*attribute_type*/ ctx[25];
    			if (dirty & /*props*/ 8) inputfield_changes.name = /*name*/ ctx[24];
    			if (dirty & /*data*/ 4) inputfield_changes.id = /*id*/ ctx[17];
    			if (dirty & /*data, props*/ 12) inputfield_changes.value = /*properties*/ ctx[21][/*name*/ ctx[24]];
    			inputfield.$set(inputfield_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(inputfield.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(inputfield.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			destroy_component(inputfield);
    		}
    	};
    }

    // (135:12) {:else}
    function create_else_block(ctx) {
    	let button;
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_3(...args) {
    		return /*click_handler_3*/ ctx[13](/*id*/ ctx[17], ...args);
    	}

    	return {
    		c() {
    			button = element("button");
    			t = text("Delete");
    			this.h();
    		},
    		l(nodes) {
    			button = claim_element(nodes, "BUTTON", { class: true, type: true });
    			var button_nodes = children(button);
    			t = claim_text(button_nodes, "Delete");
    			button_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(button, "class", "ml-auto button danger");
    			attr(button, "type", "button");
    		},
    		m(target, anchor) {
    			insert(target, button, anchor);
    			append(button, t);

    			if (!mounted) {
    				dispose = listen(button, "click", click_handler_3);
    				mounted = true;
    			}
    		},
    		p(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d(detaching) {
    			if (detaching) detach(button);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (128:12) {#if deleted_at}
    function create_if_block$1(ctx) {
    	let div;
    	let p;
    	let t0;
    	let br;
    	let t1;
    	let t2_value = getTime(/*deleted_at*/ ctx[20]) + "";
    	let t2;
    	let t3;
    	let button;
    	let t4;
    	let mounted;
    	let dispose;

    	function click_handler_2(...args) {
    		return /*click_handler_2*/ ctx[12](/*id*/ ctx[17], ...args);
    	}

    	return {
    		c() {
    			div = element("div");
    			p = element("p");
    			t0 = text("This record was deleted at: ");
    			br = element("br");
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = space();
    			button = element("button");
    			t4 = text("Restore record");
    			this.h();
    		},
    		l(nodes) {
    			div = claim_element(nodes, "DIV", { class: true });
    			var div_nodes = children(div);
    			p = claim_element(div_nodes, "P", { class: true });
    			var p_nodes = children(p);
    			t0 = claim_text(p_nodes, "This record was deleted at: ");
    			br = claim_element(p_nodes, "BR", {});
    			t1 = claim_space(p_nodes);
    			t2 = claim_text(p_nodes, t2_value);
    			p_nodes.forEach(detach);
    			t3 = claim_space(div_nodes);
    			button = claim_element(div_nodes, "BUTTON", { class: true, type: true });
    			var button_nodes = children(button);
    			t4 = claim_text(button_nodes, "Restore record");
    			button_nodes.forEach(detach);
    			div_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(p, "class", "mb-2");
    			attr(button, "class", "button secondary");
    			attr(button, "type", "button");
    			attr(div, "class", "w-64 ml-auto");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			append(div, p);
    			append(p, t0);
    			append(p, br);
    			append(p, t1);
    			append(p, t2);
    			append(div, t3);
    			append(div, button);
    			append(button, t4);

    			if (!mounted) {
    				dispose = listen(button, "click", click_handler_2);
    				mounted = true;
    			}
    		},
    		p(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*data*/ 4 && t2_value !== (t2_value = getTime(/*deleted_at*/ ctx[20]) + "")) set_data(t2, t2_value);
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (98:2) {#each data as { id, created_at, updated_at, deleted_at, properties }
    function create_each_block$1(key_1, ctx) {
    	let article;
    	let div2;
    	let div1;
    	let header;
    	let h3;
    	let t0;
    	let t1_value = /*id*/ ctx[17] + "";
    	let t1;
    	let t2;
    	let p;
    	let t3;
    	let t4_value = getTime(/*created_at*/ ctx[18]) + "";
    	let t4;
    	let t5;
    	let br;
    	let t6;
    	let t7_value = getTime(/*updated_at*/ ctx[19]) + "";
    	let t7;
    	let t8;
    	let form;
    	let t9;
    	let div0;
    	let button;
    	let t10;
    	let t11;
    	let footer;
    	let t12;
    	let article_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*props*/ ctx[3];
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	function submit_handler(...args) {
    		return /*submit_handler*/ ctx[11](/*id*/ ctx[17], ...args);
    	}

    	function select_block_type(ctx, dirty) {
    		if (/*deleted_at*/ ctx[20]) return create_if_block$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	return {
    		key: key_1,
    		first: null,
    		c() {
    			article = element("article");
    			div2 = element("div");
    			div1 = element("div");
    			header = element("header");
    			h3 = element("h3");
    			t0 = text("ID: ");
    			t1 = text(t1_value);
    			t2 = space();
    			p = element("p");
    			t3 = text("Created: ");
    			t4 = text(t4_value);
    			t5 = space();
    			br = element("br");
    			t6 = text("\r\n              Updated: ");
    			t7 = text(t7_value);
    			t8 = space();
    			form = element("form");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t9 = space();
    			div0 = element("div");
    			button = element("button");
    			t10 = text("Save");
    			t11 = space();
    			footer = element("footer");
    			if_block.c();
    			t12 = space();
    			this.h();
    		},
    		l(nodes) {
    			article = claim_element(nodes, "ARTICLE", { class: true });
    			var article_nodes = children(article);
    			div2 = claim_element(article_nodes, "DIV", { class: true });
    			var div2_nodes = children(div2);
    			div1 = claim_element(div2_nodes, "DIV", { class: true });
    			var div1_nodes = children(div1);
    			header = claim_element(div1_nodes, "HEADER", { class: true });
    			var header_nodes = children(header);
    			h3 = claim_element(header_nodes, "H3", { class: true });
    			var h3_nodes = children(h3);
    			t0 = claim_text(h3_nodes, "ID: ");
    			t1 = claim_text(h3_nodes, t1_value);
    			h3_nodes.forEach(detach);
    			t2 = claim_space(header_nodes);
    			p = claim_element(header_nodes, "P", { class: true });
    			var p_nodes = children(p);
    			t3 = claim_text(p_nodes, "Created: ");
    			t4 = claim_text(p_nodes, t4_value);
    			t5 = claim_space(p_nodes);
    			br = claim_element(p_nodes, "BR", {});
    			t6 = claim_text(p_nodes, "\r\n              Updated: ");
    			t7 = claim_text(p_nodes, t7_value);
    			p_nodes.forEach(detach);
    			header_nodes.forEach(detach);
    			t8 = claim_space(div1_nodes);
    			form = claim_element(div1_nodes, "FORM", { class: true });
    			var form_nodes = children(form);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(form_nodes);
    			}

    			t9 = claim_space(form_nodes);
    			div0 = claim_element(form_nodes, "DIV", { class: true });
    			var div0_nodes = children(div0);
    			button = claim_element(div0_nodes, "BUTTON", { class: true });
    			var button_nodes = children(button);
    			t10 = claim_text(button_nodes, "Save");
    			button_nodes.forEach(detach);
    			div0_nodes.forEach(detach);
    			form_nodes.forEach(detach);
    			t11 = claim_space(div1_nodes);
    			footer = claim_element(div1_nodes, "FOOTER", { class: true });
    			var footer_nodes = children(footer);
    			if_block.l(footer_nodes);
    			footer_nodes.forEach(detach);
    			div1_nodes.forEach(detach);
    			div2_nodes.forEach(detach);
    			t12 = claim_space(article_nodes);
    			article_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(h3, "class", "text-3xl font-light");
    			attr(p, "class", "ml-auto");
    			attr(header, "class", "flex pb-6 mb-6 border-b border-blue-600");
    			attr(button, "class", "button");
    			attr(div0, "class", "w-full mt-4");
    			attr(form, "class", "flex flex-wrap");
    			attr(footer, "class", "flex");
    			attr(div1, "class", "h-full p-8 bg-gray-200 rounded");
    			toggle_class(div1, "bg-red-200", /*deleted_at*/ ctx[20]);
    			attr(div2, "class", "w-full");
    			attr(article, "class", "flex flex-wrap w-full mb-6");
    			this.first = article;
    		},
    		m(target, anchor) {
    			insert(target, article, anchor);
    			append(article, div2);
    			append(div2, div1);
    			append(div1, header);
    			append(header, h3);
    			append(h3, t0);
    			append(h3, t1);
    			append(header, t2);
    			append(header, p);
    			append(p, t3);
    			append(p, t4);
    			append(p, t5);
    			append(p, br);
    			append(p, t6);
    			append(p, t7);
    			append(div1, t8);
    			append(div1, form);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(form, null);
    			}

    			append(form, t9);
    			append(form, div0);
    			append(div0, button);
    			append(button, t10);
    			append(div1, t11);
    			append(div1, footer);
    			if_block.m(footer, null);
    			append(article, t12);
    			current = true;

    			if (!mounted) {
    				dispose = listen(form, "submit", prevent_default(submit_handler));
    				mounted = true;
    			}
    		},
    		p(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*data*/ 4) && t1_value !== (t1_value = /*id*/ ctx[17] + "")) set_data(t1, t1_value);
    			if ((!current || dirty & /*data*/ 4) && t4_value !== (t4_value = getTime(/*created_at*/ ctx[18]) + "")) set_data(t4, t4_value);
    			if ((!current || dirty & /*data*/ 4) && t7_value !== (t7_value = getTime(/*updated_at*/ ctx[19]) + "")) set_data(t7, t7_value);

    			if (dirty & /*props, data, handleFormChanged*/ 76) {
    				each_value_1 = /*props*/ ctx[3];
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(form, t9);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(footer, null);
    				}
    			}

    			if (dirty & /*data*/ 4) {
    				toggle_class(div1, "bg-red-200", /*deleted_at*/ ctx[20]);
    			}
    		},
    		i(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			add_render_callback(() => {
    				if (!article_transition) article_transition = create_bidirectional_transition(article, slide, {}, true);
    				article_transition.run(1);
    			});

    			current = true;
    		},
    		o(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			if (!article_transition) article_transition = create_bidirectional_transition(article, slide, {}, false);
    			article_transition.run(0);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(article);
    			destroy_each(each_blocks, detaching);
    			if_block.d();
    			if (detaching && article_transition) article_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function create_fragment$3(ctx) {
    	let div4;
    	let div0;
    	let h1;
    	let t0;
    	let t1;
    	let div1;
    	let newmodel;
    	let t2;
    	let div2;
    	let filter;
    	let t3;
    	let div3;
    	let button0;
    	let t4;
    	let t5;
    	let button1;
    	let t6;
    	let t7;
    	let section;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t8;
    	let pagination;
    	let current;
    	let mounted;
    	let dispose;

    	newmodel = new New({
    			props: {
    				props: /*props*/ ctx[3],
    				schemaName: /*schemaName*/ ctx[0]
    			}
    		});

    	filter = new Filter({
    			props: {
    				props: /*props*/ ctx[3],
    				schemaId: /*schemaId*/ ctx[4]
    			}
    		});

    	let each_value = /*data*/ ctx[2];
    	const get_key = ctx => /*id*/ ctx[17];

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	pagination = new Pagination({});

    	return {
    		c() {
    			div4 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text(/*schemaName*/ ctx[0]);
    			t1 = space();
    			div1 = element("div");
    			create_component(newmodel.$$.fragment);
    			t2 = space();
    			div2 = element("div");
    			create_component(filter.$$.fragment);
    			t3 = space();
    			div3 = element("div");
    			button0 = element("button");
    			t4 = text("Show non-deleted");
    			t5 = space();
    			button1 = element("button");
    			t6 = text("Show deleted");
    			t7 = space();
    			section = element("section");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			create_component(pagination.$$.fragment);
    			this.h();
    		},
    		l(nodes) {
    			div4 = claim_element(nodes, "DIV", { class: true });
    			var div4_nodes = children(div4);
    			div0 = claim_element(div4_nodes, "DIV", { class: true });
    			var div0_nodes = children(div0);
    			h1 = claim_element(div0_nodes, "H1", { class: true });
    			var h1_nodes = children(h1);
    			t0 = claim_text(h1_nodes, /*schemaName*/ ctx[0]);
    			h1_nodes.forEach(detach);
    			div0_nodes.forEach(detach);
    			t1 = claim_space(div4_nodes);
    			div1 = claim_element(div4_nodes, "DIV", { class: true });
    			var div1_nodes = children(div1);
    			claim_component(newmodel.$$.fragment, div1_nodes);
    			div1_nodes.forEach(detach);
    			t2 = claim_space(div4_nodes);
    			div2 = claim_element(div4_nodes, "DIV", { class: true });
    			var div2_nodes = children(div2);
    			claim_component(filter.$$.fragment, div2_nodes);
    			div2_nodes.forEach(detach);
    			t3 = claim_space(div4_nodes);
    			div3 = claim_element(div4_nodes, "DIV", { class: true });
    			var div3_nodes = children(div3);
    			button0 = claim_element(div3_nodes, "BUTTON", { type: true, class: true });
    			var button0_nodes = children(button0);
    			t4 = claim_text(button0_nodes, "Show non-deleted");
    			button0_nodes.forEach(detach);
    			t5 = claim_space(div3_nodes);
    			button1 = claim_element(div3_nodes, "BUTTON", { type: true, class: true });
    			var button1_nodes = children(button1);
    			t6 = claim_text(button1_nodes, "Show deleted");
    			button1_nodes.forEach(detach);
    			div3_nodes.forEach(detach);
    			div4_nodes.forEach(detach);
    			t7 = claim_space(nodes);
    			section = claim_element(nodes, "SECTION", { class: true });
    			var section_nodes = children(section);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(section_nodes);
    			}

    			section_nodes.forEach(detach);
    			t8 = claim_space(nodes);
    			claim_component(pagination.$$.fragment, nodes);
    			this.h();
    		},
    		h() {
    			attr(h1, "class", "text-4xl");
    			attr(div0, "class", "w-1/2");
    			attr(div1, "class", "w-full");
    			attr(div2, "class", "w-full");
    			attr(button0, "type", "button");
    			attr(button0, "class", "mr-4 button secondary");
    			toggle_class(button0, "active", /*show*/ ctx[1] === "nondeleted");
    			attr(button1, "type", "button");
    			attr(button1, "class", "button secondary");
    			toggle_class(button1, "active", /*show*/ ctx[1] === "deleted");
    			attr(div3, "class", "flex w-full");
    			attr(div4, "class", "flex flex-wrap mb-6");
    			attr(section, "class", "flex flex-wrap text-gray-700 ");
    		},
    		m(target, anchor) {
    			insert(target, div4, anchor);
    			append(div4, div0);
    			append(div0, h1);
    			append(h1, t0);
    			append(div4, t1);
    			append(div4, div1);
    			mount_component(newmodel, div1, null);
    			append(div4, t2);
    			append(div4, div2);
    			mount_component(filter, div2, null);
    			append(div4, t3);
    			append(div4, div3);
    			append(div3, button0);
    			append(button0, t4);
    			append(div3, t5);
    			append(div3, button1);
    			append(button1, t6);
    			insert(target, t7, anchor);
    			insert(target, section, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section, null);
    			}

    			insert(target, t8, anchor);
    			mount_component(pagination, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(button0, "click", /*click_handler*/ ctx[9]),
    					listen(button1, "click", /*click_handler_1*/ ctx[10])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (!current || dirty & /*schemaName*/ 1) set_data(t0, /*schemaName*/ ctx[0]);
    			const newmodel_changes = {};
    			if (dirty & /*props*/ 8) newmodel_changes.props = /*props*/ ctx[3];
    			if (dirty & /*schemaName*/ 1) newmodel_changes.schemaName = /*schemaName*/ ctx[0];
    			newmodel.$set(newmodel_changes);
    			const filter_changes = {};
    			if (dirty & /*props*/ 8) filter_changes.props = /*props*/ ctx[3];
    			filter.$set(filter_changes);

    			if (dirty & /*show*/ 2) {
    				toggle_class(button0, "active", /*show*/ ctx[1] === "nondeleted");
    			}

    			if (dirty & /*show*/ 2) {
    				toggle_class(button1, "active", /*show*/ ctx[1] === "deleted");
    			}

    			if (dirty & /*data, handleUndelete, getTime, handleDelete, handleUpdateModel, props, handleFormChanged*/ 492) {
    				const each_value = /*data*/ ctx[2];
    				group_outros();
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, section, outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(newmodel.$$.fragment, local);
    			transition_in(filter.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(pagination.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(newmodel.$$.fragment, local);
    			transition_out(filter.$$.fragment, local);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div4);
    			destroy_component(newmodel);
    			destroy_component(filter);
    			if (detaching) detach(t7);
    			if (detaching) detach(section);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (detaching) detach(t8);
    			destroy_component(pagination, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $params;
    	let $modelsStore;
    	component_subscribe($$self, params, $$value => $$invalidate(15, $params = $$value));
    	component_subscribe($$self, modelsStore, $$value => $$invalidate(16, $modelsStore = $$value));
    	const schemaId = $params.id;
    	let schemaName;
    	let show = "nondeleted";
    	let data = [];
    	let props = [];

    	onMount(() => {
    		pageStore.setSchemaId(schemaId);
    		modelsStore.refreshModels(schemaId);

    		api.getModelSchemas(schemaId).then(schema => {
    			$$invalidate(0, schemaName = schema[0].name);
    			$$invalidate(3, props = schema[0].properties);
    		});
    	});

    	const handleDelete = id => {
    		const confirmation = confirm("Are you sure you want to delete this record?");
    		if (!confirmation) return;

    		api.deleteModel(id).then(data => {
    			modelsStore.refreshModels(schemaId);
    		});
    	};

    	const formCache = {};

    	const handleFormChanged = ({ detail }) => {
    		// FIXME: MONSTER - Maybe use store for that?
    		const currentData = formCache[detail.id] || {};

    		const model = Object.assign({}, currentData, detail.props);
    		formCache[detail.id] = model;
    	};

    	const handleUpdateModel = ({ id }) => {
    		api.updateModel({ id, props: formCache[id] }).then(data => {

    		});
    	};

    	const handleUndelete = id => {
    		api.undeleteModel(id).then(data => {
    			modelsStore.refreshModels(schemaId);
    		});
    	};

    	const click_handler = () => $$invalidate(1, show = "nondeleted");
    	const click_handler_1 = () => $$invalidate(1, show = "deleted");
    	const submit_handler = (id, e) => handleUpdateModel({ id });
    	const click_handler_2 = id => handleUndelete(id);
    	const click_handler_3 = id => handleDelete(id);

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*show, $modelsStore*/ 65538) {
    			if (show === "nondeleted") {
    				$$invalidate(2, data = $modelsStore.filter(m => !m.deleted_at));
    			} else {
    				$$invalidate(2, data = $modelsStore.filter(m => m.deleted_at));
    			}
    		}
    	};

    	return [
    		schemaName,
    		show,
    		data,
    		props,
    		schemaId,
    		handleDelete,
    		handleFormChanged,
    		handleUpdateModel,
    		handleUndelete,
    		click_handler,
    		click_handler_1,
    		submit_handler,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class U5Bidu5D extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$1(this, options, instance$3, create_fragment$3, safe_not_equal, {});
    	}
    }

    var _id_ = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': U5Bidu5D
    });

    /* src\pages\Users\_layout.svelte generated by Svelte v3.24.1 */

    function create_fragment$2(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	return {
    		c() {
    			if (default_slot) default_slot.c();
    		},
    		l(nodes) {
    			if (default_slot) default_slot.l(nodes);
    		},
    		m(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, $$slots];
    }

    class Layout$1 extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$1(this, options, instance$2, create_fragment$2, safe_not_equal, {});
    	}
    }

    var _layout$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Layout$1
    });

    /* src\pages\Users\index.svelte generated by Svelte v3.24.1 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i].id;
    	child_ctx[4] = list[i].email;
    	child_ctx[5] = list[i].deleted_at;
    	child_ctx[6] = list[i].created_at;
    	child_ctx[7] = list[i].first_name;
    	child_ctx[8] = list[i].last_name;
    	child_ctx[9] = list[i].external_id;
    	child_ctx[10] = list[i].jwt_token;
    	child_ctx[11] = list[i].temporary_token;
    	return child_ctx;
    }

    // (1:0) <script>    import api from "@/lib/api";    import { url }
    function create_catch_block(ctx) {
    	return {
    		c: noop,
    		l: noop,
    		m: noop,
    		p: noop,
    		d: noop
    	};
    }

    // (21:6) {:then data}
    function create_then_block(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let each_value = /*data*/ ctx[2];
    	const get_key = ctx => /*id*/ ctx[3];

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	return {
    		c() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l(nodes) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(nodes);
    			}

    			each_1_anchor = empty();
    		},
    		m(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert(target, each_1_anchor, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*$url, users*/ 3) {
    				const each_value = /*data*/ ctx[2];
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block, each_1_anchor, get_each_context);
    			}
    		},
    		d(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach(each_1_anchor);
    		}
    	};
    }

    // (38:16) {#if external_id && external_id.length > 5}
    function create_if_block(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*external_id*/ ctx[9] + "";
    	let t1;

    	return {
    		c() {
    			li = element("li");
    			t0 = text("External ID: ");
    			t1 = text(t1_value);
    			this.h();
    		},
    		l(nodes) {
    			li = claim_element(nodes, "LI", { class: true });
    			var li_nodes = children(li);
    			t0 = claim_text(li_nodes, "External ID: ");
    			t1 = claim_text(li_nodes, t1_value);
    			li_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(li, "class", "text-xs");
    		},
    		m(target, anchor) {
    			insert(target, li, anchor);
    			append(li, t0);
    			append(li, t1);
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(li);
    		}
    	};
    }

    // (22:8) {#each data as { id, email, deleted_at, created_at, first_name, last_name, external_id, jwt_token, temporary_token }
    function create_each_block(key_1, ctx) {
    	let a;
    	let div;
    	let h1;
    	let span0;
    	let t0_value = /*email*/ ctx[4] + "";
    	let t0;
    	let t1;
    	let span1;
    	let t2;
    	let t3_value = /*id*/ ctx[3] + "";
    	let t3;
    	let t4;
    	let ul;
    	let li0;
    	let t5;
    	let t6_value = /*first_name*/ ctx[7] + "";
    	let t6;
    	let t7;
    	let li1;
    	let t8;
    	let t9_value = /*last_name*/ ctx[8] + "";
    	let t9;
    	let t10;
    	let li2;
    	let t11;
    	let t12;
    	let li3;
    	let t13;
    	let t14_value = /*jwt_token*/ ctx[10] + "";
    	let t14;
    	let t15;
    	let a_href_value;
    	let if_block = /*external_id*/ ctx[9] && /*external_id*/ ctx[9].length > 5 && create_if_block(ctx);

    	return {
    		key: key_1,
    		first: null,
    		c() {
    			a = element("a");
    			div = element("div");
    			h1 = element("h1");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			span1 = element("span");
    			t2 = text("ID: ");
    			t3 = text(t3_value);
    			t4 = space();
    			ul = element("ul");
    			li0 = element("li");
    			t5 = text("First name: ");
    			t6 = text(t6_value);
    			t7 = space();
    			li1 = element("li");
    			t8 = text("Last name: ");
    			t9 = text(t9_value);
    			t10 = space();
    			li2 = element("li");
    			t11 = space();
    			if (if_block) if_block.c();
    			t12 = space();
    			li3 = element("li");
    			t13 = text("JWT: ");
    			t14 = text(t14_value);
    			t15 = space();
    			this.h();
    		},
    		l(nodes) {
    			a = claim_element(nodes, "A", { class: true, href: true });
    			var a_nodes = children(a);
    			div = claim_element(a_nodes, "DIV", { class: true });
    			var div_nodes = children(div);
    			h1 = claim_element(div_nodes, "H1", { class: true });
    			var h1_nodes = children(h1);
    			span0 = claim_element(h1_nodes, "SPAN", {});
    			var span0_nodes = children(span0);
    			t0 = claim_text(span0_nodes, t0_value);
    			span0_nodes.forEach(detach);
    			t1 = claim_space(h1_nodes);
    			span1 = claim_element(h1_nodes, "SPAN", {});
    			var span1_nodes = children(span1);
    			t2 = claim_text(span1_nodes, "ID: ");
    			t3 = claim_text(span1_nodes, t3_value);
    			span1_nodes.forEach(detach);
    			h1_nodes.forEach(detach);
    			t4 = claim_space(div_nodes);
    			ul = claim_element(div_nodes, "UL", { class: true });
    			var ul_nodes = children(ul);
    			li0 = claim_element(ul_nodes, "LI", {});
    			var li0_nodes = children(li0);
    			t5 = claim_text(li0_nodes, "First name: ");
    			t6 = claim_text(li0_nodes, t6_value);
    			li0_nodes.forEach(detach);
    			t7 = claim_space(ul_nodes);
    			li1 = claim_element(ul_nodes, "LI", {});
    			var li1_nodes = children(li1);
    			t8 = claim_text(li1_nodes, "Last name: ");
    			t9 = claim_text(li1_nodes, t9_value);
    			li1_nodes.forEach(detach);
    			t10 = claim_space(ul_nodes);
    			li2 = claim_element(ul_nodes, "LI", { class: true });
    			children(li2).forEach(detach);
    			t11 = claim_space(ul_nodes);
    			if (if_block) if_block.l(ul_nodes);
    			t12 = claim_space(ul_nodes);
    			li3 = claim_element(ul_nodes, "LI", { class: true });
    			var li3_nodes = children(li3);
    			t13 = claim_text(li3_nodes, "JWT: ");
    			t14 = claim_text(li3_nodes, t14_value);
    			li3_nodes.forEach(detach);
    			ul_nodes.forEach(detach);
    			div_nodes.forEach(detach);
    			t15 = claim_space(a_nodes);
    			a_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(h1, "class", "flex justify-between pb-2 mb-2 text-2xl leading-relaxed");
    			attr(li2, "class", "pt-2 mt-4 text-xs border-t border-gray-400");
    			attr(li3, "class", "text-xs");
    			attr(ul, "class", "text-sm");
    			attr(div, "class", "relative flex flex-col h-full p-5 bg-gray-200 border border-gray-400 hover:bg-gray-300 hover:shadow-md");
    			attr(a, "class", "");
    			attr(a, "href", a_href_value = /*$url*/ ctx[0]("../Manage/:id", { id: /*id*/ ctx[3] }));
    			this.first = a;
    		},
    		m(target, anchor) {
    			insert(target, a, anchor);
    			append(a, div);
    			append(div, h1);
    			append(h1, span0);
    			append(span0, t0);
    			append(h1, t1);
    			append(h1, span1);
    			append(span1, t2);
    			append(span1, t3);
    			append(div, t4);
    			append(div, ul);
    			append(ul, li0);
    			append(li0, t5);
    			append(li0, t6);
    			append(ul, t7);
    			append(ul, li1);
    			append(li1, t8);
    			append(li1, t9);
    			append(ul, t10);
    			append(ul, li2);
    			append(ul, t11);
    			if (if_block) if_block.m(ul, null);
    			append(ul, t12);
    			append(ul, li3);
    			append(li3, t13);
    			append(li3, t14);
    			append(a, t15);
    		},
    		p(ctx, dirty) {
    			if (/*external_id*/ ctx[9] && /*external_id*/ ctx[9].length > 5) if_block.p(ctx, dirty);

    			if (dirty & /*$url*/ 1 && a_href_value !== (a_href_value = /*$url*/ ctx[0]("../Manage/:id", { id: /*id*/ ctx[3] }))) {
    				attr(a, "href", a_href_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(a);
    			if (if_block) if_block.d();
    		}
    	};
    }

    // (19:22)           <p>Loading...</p>        {:then data}
    function create_pending_block(ctx) {
    	let p;
    	let t;

    	return {
    		c() {
    			p = element("p");
    			t = text("Loading...");
    		},
    		l(nodes) {
    			p = claim_element(nodes, "P", {});
    			var p_nodes = children(p);
    			t = claim_text(p_nodes, "Loading...");
    			p_nodes.forEach(detach);
    		},
    		m(target, anchor) {
    			insert(target, p, anchor);
    			append(p, t);
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(p);
    		}
    	};
    }

    function create_fragment$1(ctx) {
    	let h1;
    	let t0;
    	let t1;
    	let p;
    	let t2;
    	let t3;
    	let section;
    	let div1;
    	let div0;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 2
    	};

    	handle_promise(/*users*/ ctx[1](), info);

    	return {
    		c() {
    			h1 = element("h1");
    			t0 = text("Users");
    			t1 = space();
    			p = element("p");
    			t2 = text("Choose schema that you want to see models for.");
    			t3 = space();
    			section = element("section");
    			div1 = element("div");
    			div0 = element("div");
    			info.block.c();
    			this.h();
    		},
    		l(nodes) {
    			h1 = claim_element(nodes, "H1", { class: true });
    			var h1_nodes = children(h1);
    			t0 = claim_text(h1_nodes, "Users");
    			h1_nodes.forEach(detach);
    			t1 = claim_space(nodes);
    			p = claim_element(nodes, "P", {});
    			var p_nodes = children(p);
    			t2 = claim_text(p_nodes, "Choose schema that you want to see models for.");
    			p_nodes.forEach(detach);
    			t3 = claim_space(nodes);
    			section = claim_element(nodes, "SECTION", { class: true });
    			var section_nodes = children(section);
    			div1 = claim_element(section_nodes, "DIV", { class: true });
    			var div1_nodes = children(div1);
    			div0 = claim_element(div1_nodes, "DIV", { class: true });
    			var div0_nodes = children(div0);
    			info.block.l(div0_nodes);
    			div0_nodes.forEach(detach);
    			div1_nodes.forEach(detach);
    			section_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(h1, "class", "mb-2 text-5xl");
    			attr(div0, "class", "grid gap-5 lg:grid-cols-2");
    			attr(div1, "class", "container py-8");
    			attr(section, "class", "overflow-hidden");
    		},
    		m(target, anchor) {
    			insert(target, h1, anchor);
    			append(h1, t0);
    			insert(target, t1, anchor);
    			insert(target, p, anchor);
    			append(p, t2);
    			insert(target, t3, anchor);
    			insert(target, section, anchor);
    			append(section, div1);
    			append(div1, div0);
    			info.block.m(div0, info.anchor = null);
    			info.mount = () => div0;
    			info.anchor = null;
    		},
    		p(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			{
    				const child_ctx = ctx.slice();
    				child_ctx[2] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(h1);
    			if (detaching) detach(t1);
    			if (detaching) detach(p);
    			if (detaching) detach(t3);
    			if (detaching) detach(section);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $url;
    	component_subscribe($$self, url, $$value => $$invalidate(0, $url = $$value));

    	const users = async () => {
    		const res = await api.getUsers();
    		return res.users.results;
    	};

    	return [$url, users];
    }

    class Users extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$1(this, options, instance$1, create_fragment$1, safe_not_equal, {});
    	}
    }

    var index = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Users
    });

    /* src\pages\Users\Manage\_layout.svelte generated by Svelte v3.24.1 */

    function create_fragment(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	return {
    		c() {
    			if (default_slot) default_slot.c();
    		},
    		l(nodes) {
    			if (default_slot) default_slot.l(nodes);
    		},
    		m(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, $$slots];
    }

    class Layout extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$1(this, options, instance, create_fragment, safe_not_equal, {});
    	}
    }

    var _layout = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': Layout
    });

    return app;

}());
