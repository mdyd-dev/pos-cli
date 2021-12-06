import { S as SvelteComponent, i as init, s as safe_not_equal, e as element, t as text, b as space, c as claim_element, d as children, f as claim_text, g as detach, h as claim_space, j as attr, k as insert, a as append, p as listen, K as prevent_default, q as set_data, n as noop, L as run_all, M as binding_callbacks } from './main2.js';
import { a as api } from './api.js';
import { f as fetchConstants } from './fetchConstants.js';
import './store.js';
import './store2.js';

/* src/pages/Constants/Item.svelte generated by Svelte v3.24.1 */

function create_fragment(ctx) {
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

function instance($$self, $$props, $$invalidate) {
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

class Item extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { item: 0 });
	}
}

export default Item;
