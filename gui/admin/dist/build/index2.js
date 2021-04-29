import { S as SvelteComponent, i as init, s as safe_not_equal, K as handle_promise, e as element, t as text, b as space, c as claim_element, d as children, f as claim_text, g as detach, h as claim_space, j as attr, k as insert, a as append, n as noop, l as component_subscribe, u as url, L as empty, w as update_keyed_each, M as destroy_block, N as HtmlTag } from './main2.js';
import { a as api } from './api.js';
import './store.js';

/* src/pages/Models/index.svelte generated by Svelte v3.24.1 */

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[4] = list[i].id;
	child_ctx[5] = list[i].name;
	child_ctx[6] = list[i].properties;
	return child_ctx;
}

// (1:0) <script>   import api from "@/lib/api";   import { url }
function create_catch_block(ctx) {
	return {
		c: noop,
		l: noop,
		m: noop,
		p: noop,
		d: noop
	};
}

// (33:6) {:then data}
function create_then_block(ctx) {
	let each_blocks = [];
	let each_1_lookup = new Map();
	let each_1_anchor;
	let each_value = /*data*/ ctx[3];
	const get_key = ctx => /*id*/ ctx[4];

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
			if (dirty & /*$url, getModelSchemas, getProps*/ 7) {
				const each_value = /*data*/ ctx[3];
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

// (34:8) {#each data as { id, name, properties }
function create_each_block(key_1, ctx) {
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

// (31:32)          <p>Loading...</p>       {:then data}
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

function create_fragment(ctx) {
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
		value: 3
	};

	handle_promise(/*getModelSchemas*/ ctx[1](), info);

	return {
		c() {
			h1 = element("h1");
			t0 = text("Models");
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
			t0 = claim_text(h1_nodes, "Models");
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

function instance($$self, $$props, $$invalidate) {
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
		init(this, options, instance, create_fragment, safe_not_equal, {});
	}
}

export default Models;
