import { S as SvelteComponent, i as init, s as safe_not_equal, e as element, J as svg_element, b as space, t as text, c as claim_element, d as children, g as detach, h as claim_space, f as claim_text, j as attr, k as insert, a as append, n as noop, l as component_subscribe, u as url } from './main2.js';

/* src/pages/index.svelte generated by Svelte v3.24.1 */

function create_fragment(ctx) {
	let section0;
	let div9;
	let div8;
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
	let hr;
	let t18;
	let section1;
	let div17;
	let div16;
	let div12;
	let div11;
	let img0;
	let img0_src_value;
	let t19;
	let div10;
	let h22;
	let t20;
	let t21;
	let ul2;
	let li4;
	let t22;
	let t23;
	let li5;
	let t24;
	let t25;
	let li6;
	let t26;
	let t27;
	let a2;
	let t28;
	let svg4;
	let path4;
	let t29;
	let div15;
	let div14;
	let img1;
	let img1_src_value;
	let t30;
	let div13;
	let h23;
	let t31;
	let t32;
	let ul3;
	let li7;
	let t33;
	let t34;
	let li8;
	let t35;
	let t36;
	let li9;
	let t37;
	let t38;
	let a3;
	let t39;
	let svg5;
	let path5;

	return {
		c() {
			section0 = element("section");
			div9 = element("div");
			div8 = element("div");
			div3 = element("div");
			div2 = element("div");
			div0 = element("div");
			svg0 = svg_element("svg");
			path0 = svg_element("path");
			t0 = space();
			div1 = element("div");
			h20 = element("h2");
			t1 = text("Manage models in your application");
			t2 = space();
			ul0 = element("ul");
			li0 = element("li");
			t3 = text("Inspect model schemas");
			t4 = space();
			li1 = element("li");
			t5 = text("Manage models (create, read, update, delete)");
			t6 = space();
			a0 = element("a");
			t7 = text("Go to Models\n              ");
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
			t16 = text("Go to Users\n              ");
			svg3 = svg_element("svg");
			path3 = svg_element("path");
			t17 = space();
			hr = element("hr");
			t18 = space();
			section1 = element("section");
			div17 = element("div");
			div16 = element("div");
			div12 = element("div");
			div11 = element("div");
			img0 = element("img");
			t19 = space();
			div10 = element("div");
			h22 = element("h2");
			t20 = text("Liquid Evaluator");
			t21 = space();
			ul2 = element("ul");
			li4 = element("li");
			t22 = text("Run Liquid code against your instance");
			t23 = space();
			li5 = element("li");
			t24 = text("Test Liquid logic");
			t25 = space();
			li6 = element("li");
			t26 = text("Quickly prototype your ideas");
			t27 = space();
			a2 = element("a");
			t28 = text("Go to Liquid Evaluator\n              ");
			svg4 = svg_element("svg");
			path4 = svg_element("path");
			t29 = space();
			div15 = element("div");
			div14 = element("div");
			img1 = element("img");
			t30 = space();
			div13 = element("div");
			h23 = element("h2");
			t31 = text("GraphiQL");
			t32 = space();
			ul3 = element("ul");
			li7 = element("li");
			t33 = text("Run GraphQL against your instance");
			t34 = space();
			li8 = element("li");
			t35 = text("Explore documentation");
			t36 = space();
			li9 = element("li");
			t37 = text("Quickly prototype your queries and mutations");
			t38 = space();
			a3 = element("a");
			t39 = text("Go to GraphiQL\n              ");
			svg5 = svg_element("svg");
			path5 = svg_element("path");
			this.h();
		},
		l(nodes) {
			section0 = claim_element(nodes, "SECTION", { class: true });
			var section0_nodes = children(section0);
			div9 = claim_element(section0_nodes, "DIV", { class: true });
			var div9_nodes = children(div9);
			div8 = claim_element(div9_nodes, "DIV", { class: true });
			var div8_nodes = children(div8);
			div3 = claim_element(div8_nodes, "DIV", { class: true });
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
			t1 = claim_text(h20_nodes, "Manage models in your application");
			h20_nodes.forEach(detach);
			t2 = claim_space(div1_nodes);
			ul0 = claim_element(div1_nodes, "UL", { class: true });
			var ul0_nodes = children(ul0);
			li0 = claim_element(ul0_nodes, "LI", {});
			var li0_nodes = children(li0);
			t3 = claim_text(li0_nodes, "Inspect model schemas");
			li0_nodes.forEach(detach);
			t4 = claim_space(ul0_nodes);
			li1 = claim_element(ul0_nodes, "LI", {});
			var li1_nodes = children(li1);
			t5 = claim_text(li1_nodes, "Manage models (create, read, update, delete)");
			li1_nodes.forEach(detach);
			ul0_nodes.forEach(detach);
			t6 = claim_space(div1_nodes);
			a0 = claim_element(div1_nodes, "A", { href: true, class: true });
			var a0_nodes = children(a0);
			t7 = claim_text(a0_nodes, "Go to Models\n              ");

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
			t8 = claim_space(div8_nodes);
			div7 = claim_element(div8_nodes, "DIV", { class: true });
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
			t16 = claim_text(a1_nodes, "Go to Users\n              ");

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
			div8_nodes.forEach(detach);
			div9_nodes.forEach(detach);
			section0_nodes.forEach(detach);
			t17 = claim_space(nodes);
			hr = claim_element(nodes, "HR", {});
			t18 = claim_space(nodes);
			section1 = claim_element(nodes, "SECTION", { class: true });
			var section1_nodes = children(section1);
			div17 = claim_element(section1_nodes, "DIV", { class: true });
			var div17_nodes = children(div17);
			div16 = claim_element(div17_nodes, "DIV", { class: true });
			var div16_nodes = children(div16);
			div12 = claim_element(div16_nodes, "DIV", { class: true });
			var div12_nodes = children(div12);
			div11 = claim_element(div12_nodes, "DIV", { class: true });
			var div11_nodes = children(div11);
			img0 = claim_element(div11_nodes, "IMG", { src: true, alt: true, class: true });
			t19 = claim_space(div11_nodes);
			div10 = claim_element(div11_nodes, "DIV", { class: true });
			var div10_nodes = children(div10);
			h22 = claim_element(div10_nodes, "H2", { class: true });
			var h22_nodes = children(h22);
			t20 = claim_text(h22_nodes, "Liquid Evaluator");
			h22_nodes.forEach(detach);
			t21 = claim_space(div10_nodes);
			ul2 = claim_element(div10_nodes, "UL", { class: true });
			var ul2_nodes = children(ul2);
			li4 = claim_element(ul2_nodes, "LI", {});
			var li4_nodes = children(li4);
			t22 = claim_text(li4_nodes, "Run Liquid code against your instance");
			li4_nodes.forEach(detach);
			t23 = claim_space(ul2_nodes);
			li5 = claim_element(ul2_nodes, "LI", {});
			var li5_nodes = children(li5);
			t24 = claim_text(li5_nodes, "Test Liquid logic");
			li5_nodes.forEach(detach);
			t25 = claim_space(ul2_nodes);
			li6 = claim_element(ul2_nodes, "LI", {});
			var li6_nodes = children(li6);
			t26 = claim_text(li6_nodes, "Quickly prototype your ideas");
			li6_nodes.forEach(detach);
			ul2_nodes.forEach(detach);
			t27 = claim_space(div10_nodes);
			a2 = claim_element(div10_nodes, "A", { href: true, target: true, class: true });
			var a2_nodes = children(a2);
			t28 = claim_text(a2_nodes, "Go to Liquid Evaluator\n              ");

			svg4 = claim_element(
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

			var svg4_nodes = children(svg4);
			path4 = claim_element(svg4_nodes, "path", { d: true }, 1);
			children(path4).forEach(detach);
			svg4_nodes.forEach(detach);
			a2_nodes.forEach(detach);
			div10_nodes.forEach(detach);
			div11_nodes.forEach(detach);
			div12_nodes.forEach(detach);
			t29 = claim_space(div16_nodes);
			div15 = claim_element(div16_nodes, "DIV", { class: true });
			var div15_nodes = children(div15);
			div14 = claim_element(div15_nodes, "DIV", { class: true });
			var div14_nodes = children(div14);
			img1 = claim_element(div14_nodes, "IMG", { src: true, alt: true, class: true });
			t30 = claim_space(div14_nodes);
			div13 = claim_element(div14_nodes, "DIV", { class: true });
			var div13_nodes = children(div13);
			h23 = claim_element(div13_nodes, "H2", { class: true });
			var h23_nodes = children(h23);
			t31 = claim_text(h23_nodes, "GraphiQL");
			h23_nodes.forEach(detach);
			t32 = claim_space(div13_nodes);
			ul3 = claim_element(div13_nodes, "UL", { class: true });
			var ul3_nodes = children(ul3);
			li7 = claim_element(ul3_nodes, "LI", {});
			var li7_nodes = children(li7);
			t33 = claim_text(li7_nodes, "Run GraphQL against your instance");
			li7_nodes.forEach(detach);
			t34 = claim_space(ul3_nodes);
			li8 = claim_element(ul3_nodes, "LI", {});
			var li8_nodes = children(li8);
			t35 = claim_text(li8_nodes, "Explore documentation");
			li8_nodes.forEach(detach);
			t36 = claim_space(ul3_nodes);
			li9 = claim_element(ul3_nodes, "LI", {});
			var li9_nodes = children(li9);
			t37 = claim_text(li9_nodes, "Quickly prototype your queries and mutations");
			li9_nodes.forEach(detach);
			ul3_nodes.forEach(detach);
			t38 = claim_space(div13_nodes);
			a3 = claim_element(div13_nodes, "A", { href: true, target: true, class: true });
			var a3_nodes = children(a3);
			t39 = claim_text(a3_nodes, "Go to GraphiQL\n              ");

			svg5 = claim_element(
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

			var svg5_nodes = children(svg5);
			path5 = claim_element(svg5_nodes, "path", { d: true }, 1);
			children(path5).forEach(detach);
			svg5_nodes.forEach(detach);
			a3_nodes.forEach(detach);
			div13_nodes.forEach(detach);
			div14_nodes.forEach(detach);
			div15_nodes.forEach(detach);
			div16_nodes.forEach(detach);
			div17_nodes.forEach(detach);
			section1_nodes.forEach(detach);
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
			attr(div8, "class", "flex flex-wrap w-full -m-4");
			attr(div9, "class", "container flex flex-wrap py-8 mx-auto");
			attr(section0, "class", "text-gray-700 ");
			if (img0.src !== (img0_src_value = "./dupa.png")) attr(img0, "src", img0_src_value);
			attr(img0, "alt", "Liquid Evaluator");
			attr(img0, "class", "w-1/3 mr-6 shadow-md");
			attr(h22, "class", "mb-3 text-lg font-medium text-gray-900 title-font");
			attr(ul2, "class", "text-sm list-disc list-inside");
			attr(path4, "d", "M5 12h14M12 5l7 7-7 7");
			attr(svg4, "fill", "none");
			attr(svg4, "stroke", "currentColor");
			attr(svg4, "stroke-linecap", "round");
			attr(svg4, "stroke-linejoin", "round");
			attr(svg4, "stroke-width", "2");
			attr(svg4, "class", "w-4 h-4 ml-2");
			attr(svg4, "viewBox", "0 0 24 24");
			attr(a2, "href", "/gui/liquid");
			attr(a2, "target", "_blank");
			attr(a2, "class", "inline-flex items-center mt-3 text-blue-500");
			attr(div10, "class", "flex-grow");
			attr(div11, "class", "flex p-8 border-2 border-gray-200 rounded-lg");
			attr(div12, "class", "p-4 lg:w-1/2 md:w-full");
			if (img1.src !== (img1_src_value = "./graphiql.png")) attr(img1, "src", img1_src_value);
			attr(img1, "alt", "Liquid Evaluator");
			attr(img1, "class", "w-1/3 mr-6 shadow-md");
			attr(h23, "class", "mb-3 text-lg font-medium text-gray-900 title-font");
			attr(ul3, "class", "text-sm list-disc list-inside");
			attr(path5, "d", "M5 12h14M12 5l7 7-7 7");
			attr(svg5, "fill", "none");
			attr(svg5, "stroke", "currentColor");
			attr(svg5, "stroke-linecap", "round");
			attr(svg5, "stroke-linejoin", "round");
			attr(svg5, "stroke-width", "2");
			attr(svg5, "class", "w-4 h-4 ml-2");
			attr(svg5, "viewBox", "0 0 24 24");
			attr(a3, "href", "/gui/graphql");
			attr(a3, "target", "_blank");
			attr(a3, "class", "inline-flex items-center mt-3 text-blue-500");
			attr(div13, "class", "flex-grow");
			attr(div14, "class", "flex p-8 border-2 border-gray-200 rounded-lg");
			attr(div15, "class", "p-4 lg:w-1/2 md:w-full");
			attr(div16, "class", "flex flex-wrap w-full -m-4");
			attr(div17, "class", "container flex flex-wrap py-8 mx-auto");
			attr(section1, "class", "text-gray-700 ");
		},
		m(target, anchor) {
			insert(target, section0, anchor);
			append(section0, div9);
			append(div9, div8);
			append(div8, div3);
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
			append(div8, t8);
			append(div8, div7);
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
			insert(target, t17, anchor);
			insert(target, hr, anchor);
			insert(target, t18, anchor);
			insert(target, section1, anchor);
			append(section1, div17);
			append(div17, div16);
			append(div16, div12);
			append(div12, div11);
			append(div11, img0);
			append(div11, t19);
			append(div11, div10);
			append(div10, h22);
			append(h22, t20);
			append(div10, t21);
			append(div10, ul2);
			append(ul2, li4);
			append(li4, t22);
			append(ul2, t23);
			append(ul2, li5);
			append(li5, t24);
			append(ul2, t25);
			append(ul2, li6);
			append(li6, t26);
			append(div10, t27);
			append(div10, a2);
			append(a2, t28);
			append(a2, svg4);
			append(svg4, path4);
			append(div16, t29);
			append(div16, div15);
			append(div15, div14);
			append(div14, img1);
			append(div14, t30);
			append(div14, div13);
			append(div13, h23);
			append(h23, t31);
			append(div13, t32);
			append(div13, ul3);
			append(ul3, li7);
			append(li7, t33);
			append(ul3, t34);
			append(ul3, li8);
			append(li8, t35);
			append(ul3, t36);
			append(ul3, li9);
			append(li9, t37);
			append(div13, t38);
			append(div13, a3);
			append(a3, t39);
			append(a3, svg5);
			append(svg5, path5);
		},
		p(ctx, [dirty]) {
			if (dirty & /*$url*/ 1 && a0_href_value !== (a0_href_value = /*$url*/ ctx[0]("../Models/index"))) {
				attr(a0, "href", a0_href_value);
			}

			if (dirty & /*$url*/ 1 && a1_href_value !== (a1_href_value = /*$url*/ ctx[0]("../Users/index"))) {
				attr(a1, "href", a1_href_value);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(section0);
			if (detaching) detach(t17);
			if (detaching) detach(hr);
			if (detaching) detach(t18);
			if (detaching) detach(section1);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let $url;
	component_subscribe($$self, url, $$value => $$invalidate(0, $url = $$value));
	return [$url];
}

class Pages extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, {});
	}
}

export default Pages;
