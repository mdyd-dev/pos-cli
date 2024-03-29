import { S as SvelteComponent, i as init, s as safe_not_equal, e as element, t as text, b as space, c as claim_element, d as children, f as claim_text, g as detach, h as claim_space, j as attr, k as insert, a as append, q as set_data, n as noop, l as component_subscribe } from './main2.js';
import { c as constants } from './store2.js';

/* src\pages\Constants\Details.svelte generated by Svelte v3.24.1 */

function create_fragment(ctx) {
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

function instance($$self, $$props, $$invalidate) {
	let $constants;
	component_subscribe($$self, constants, $$value => $$invalidate(0, $constants = $$value));
	return [$constants];
}

class Details extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, {});
	}
}

export default Details;
