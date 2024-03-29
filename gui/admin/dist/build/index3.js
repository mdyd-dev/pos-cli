import { I as writable, N as get_store_value, S as SvelteComponent, i as init, s as safe_not_equal, D as create_component, E as claim_component, F as mount_component, z as transition_in, A as transition_out, H as destroy_component, e as element, t as text, b as space, c as claim_element, d as children, f as claim_text, g as detach, h as claim_space, j as attr, k as insert, a as append, P as set_input_value, p as listen, y as check_outros, Q as destroy_each, L as run_all, l as component_subscribe, R as onMount, v as group_outros } from './main2.js';
import Item from './Item2.js';
import './index4.js';

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

/* src\pages\Logs\index.svelte generated by Svelte v3.24.1 */

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[3] = list[i];
	return child_ctx;
}

// (30:4) {#each $logs as log}
function create_each_block(ctx) {
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

function create_fragment(ctx) {
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
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
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
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
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

function instance($$self, $$props, $$invalidate) {
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
		init(this, options, instance, create_fragment, safe_not_equal, {});
	}
}

export default Logs;
