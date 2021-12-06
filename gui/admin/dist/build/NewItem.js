import { S as SvelteComponent, i as init, s as safe_not_equal, e as element, t as text, b as space, c as claim_element, d as children, f as claim_text, g as detach, h as claim_space, j as attr, k as insert, a as append, p as listen, K as prevent_default, n as noop, M as binding_callbacks } from './main2.js';
import { a as api } from './api.js';
import { f as fetchConstants } from './fetchConstants.js';
import './store.js';
import './store2.js';

/* src/pages/Constants/NewItem.svelte generated by Svelte v3.24.1 */

function create_fragment(ctx) {
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

function instance($$self, $$props, $$invalidate) {
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
		init(this, options, instance, create_fragment, safe_not_equal, {});
	}
}

export default NewItem;
