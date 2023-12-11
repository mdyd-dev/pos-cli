import { S as SvelteComponent, i as init, s as safe_not_equal, e as element, c as claim_element, d as children, g as detach, j as attr, k as insert, a as append, n as noop, t as text, b as space, f as claim_text, h as claim_space, m as globals, o as set_style, p as listen, q as set_data, r as create_out_transition, v as group_outros, w as update_keyed_each, x as outro_and_destroy_block, y as check_outros, z as transition_in, A as transition_out, B as onDestroy, C as create_slot, D as create_component, E as claim_component, F as mount_component, G as update_slot, H as destroy_component } from './main2.js';
import { n as notification } from './store.js';

/* src\_components\Header.svelte generated by Svelte v3.24.1 */

function create_fragment$3(ctx) {
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
		init(this, options, null, create_fragment$3, safe_not_equal, {});
	}
}

/* src\_components\Footer.svelte generated by Svelte v3.24.1 */

function create_fragment$2(ctx) {
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
		init(this, options, null, create_fragment$2, safe_not_equal, {});
	}
}

/* node_modules\@beyonk\svelte-notifications\src\Notifications.svelte generated by Svelte v3.24.1 */

const { document: document_1 } = globals;

function add_css() {
	var style = element("style");
	style.id = "svelte-riwzrl-style";
	style.textContent = ".toasts{list-style:none;position:fixed;top:0;right:0;padding:0;margin:0;z-index:9999}.svelte-riwzrl.svelte-riwzrl.toasts>.toast.svelte-riwzrl.svelte-riwzrl{position:relative;margin:1vh 1vw;min-width:40vw;position:relative;animation:svelte-riwzrl-animate-in 600ms forwards;color:#fff}.svelte-riwzrl.toasts>.toast.svelte-riwzrl>.content.svelte-riwzrl{padding:1vw;display:block;font-weight:500}.svelte-riwzrl.toasts>.toast.svelte-riwzrl>.progress.svelte-riwzrl{position:absolute;bottom:0;background-color:rgb(0, 0, 0, 0.3);height:6px;width:100%;animation-name:svelte-riwzrl-shrink;animation-timing-function:linear;animation-fill-mode:forwards}.svelte-riwzrl.svelte-riwzrl.toasts>.toast.svelte-riwzrl.svelte-riwzrl:before,.svelte-riwzrl.svelte-riwzrl.toasts>.toast.svelte-riwzrl.svelte-riwzrl:after{content:\"\";position:absolute;z-index:-1;top:50%;bottom:0;left:1vw;right:1vw;border-radius:100px / 10px}.svelte-riwzrl.svelte-riwzrl.toasts>.toast.svelte-riwzrl.svelte-riwzrl:after{right:1vw;left:auto;transform:skew(8deg) rotate(3deg)}@keyframes svelte-riwzrl-animate-in{0%,60%,75%,90%,to{-webkit-animation-timing-function:cubic-bezier(.215, .61, .355, 1);animation-timing-function:cubic-bezier(.215, .61, .355, 1)}0%{opacity:0;transform:translate3d(3000px, 0, 0)}60%{opacity:1;transform:translate3d(-25px, 0, 0)}75%{transform:translate3d(10px, 0, 0)}90%{transform:translate3d(-5px, 0, 0)}to{transform:none}}@keyframes svelte-riwzrl-shrink{0%{width:98vw}100%{width:0}}@media(min-width: 480px){@keyframes svelte-riwzrl-animate-in{0%,60%,75%,90%,to{-webkit-animation-timing-function:cubic-bezier(.215, .61, .355, 1);animation-timing-function:cubic-bezier(.215, .61, .355, 1)}0%{opacity:0;transform:translate3d(3000px, 0, 0)}60%{opacity:1;transform:translate3d(-25px, 0, 0)}75%{transform:translate3d(10px, 0, 0)}90%{transform:translate3d(-5px, 0, 0)}to{transform:none}}@keyframes svelte-riwzrl-shrink{0%{width:40vw}100%{width:0}}}";
	append(document_1.head, style);
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	return child_ctx;
}

// (2:1) {#each toasts as toast (toast.id)}
function create_each_block(key_1, ctx) {
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

function create_fragment$1(ctx) {
	let ul;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let current;
	let each_value = /*toasts*/ ctx[0];
	const get_key = ctx => /*toast*/ ctx[8].id;

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
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
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, outro_and_destroy_block, create_each_block, null, get_each_context);
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

function instance$1($$self, $$props, $$invalidate) {
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
		if (!document_1.getElementById("svelte-riwzrl-style")) add_css();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { themes: 2, timeout: 3 });
	}
}

/* src\pages\_layout.svelte generated by Svelte v3.24.1 */

function create_fragment(ctx) {
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
		init(this, options, instance, create_fragment, safe_not_equal, {});
	}
}

export default Layout;
