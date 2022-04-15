
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
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
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
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
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
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
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
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
        seen_callbacks.clear();
        set_current_component(saved_component);
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
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
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
        }
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
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
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
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
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
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
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

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.47.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\App.svelte generated by Svelte v3.47.0 */

    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let section0;
    	let nav;
    	let div0;
    	let a0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let a1;
    	let t2;
    	let div1;
    	let a2;
    	let t4;
    	let a3;
    	let t6;
    	let main0;
    	let div2;
    	let h10;
    	let t8;
    	let p0;
    	let t10;
    	let div3;
    	let img1;
    	let img1_src_value;
    	let t11;
    	let section1;
    	let main5;
    	let header0;
    	let h11;
    	let t13;
    	let main4;
    	let div4;
    	let header1;
    	let p1;
    	let t15;
    	let main1;
    	let p2;
    	let t17;
    	let div5;
    	let header2;
    	let p3;
    	let t19;
    	let main2;
    	let p4;
    	let t21;
    	let div6;
    	let header3;
    	let p5;
    	let t23;
    	let main3;
    	let p6;
    	let t25;
    	let section2;
    	let main6;
    	let header4;
    	let h12;
    	let t27;
    	let p7;
    	let t29;
    	let div7;
    	let img2;
    	let img2_src_value;
    	let t30;
    	let section3;
    	let main8;
    	let header5;
    	let h13;
    	let t32;
    	let main7;
    	let a4;
    	let t34;
    	let footer;
    	let p8;

    	const block = {
    		c: function create() {
    			section0 = element("section");
    			nav = element("nav");
    			div0 = element("div");
    			a0 = element("a");
    			img0 = element("img");
    			t0 = space();
    			a1 = element("a");
    			a1.textContent = "MyAnimeTab";
    			t2 = space();
    			div1 = element("div");
    			a2 = element("a");
    			a2.textContent = "Install";
    			t4 = space();
    			a3 = element("a");
    			a3.textContent = "GitHub";
    			t6 = space();
    			main0 = element("main");
    			div2 = element("div");
    			h10 = element("h1");
    			h10.textContent = "MyAnimeTab - A Firefox Startpage for Anime Enjoyers";
    			t8 = space();
    			p0 = element("p");
    			p0.textContent = "MyAnimeTab is a Firefox addon that replaces the default Startpage with a customizable one.";
    			t10 = space();
    			div3 = element("div");
    			img1 = element("img");
    			t11 = space();
    			section1 = element("section");
    			main5 = element("main");
    			header0 = element("header");
    			h11 = element("h1");
    			h11.textContent = "It comes with a wide collection of widgets";
    			t13 = space();
    			main4 = element("main");
    			div4 = element("div");
    			header1 = element("header");
    			p1 = element("p");
    			p1.textContent = "Clock";
    			t15 = space();
    			main1 = element("main");
    			p2 = element("p");
    			p2.textContent = "A simple yet powerful clock. It displays the current time but also enables setting alarms. Great to keep track of your pizza!";
    			t17 = space();
    			div5 = element("div");
    			header2 = element("header");
    			p3 = element("p");
    			p3.textContent = "Weather";
    			t19 = space();
    			main2 = element("main");
    			p4 = element("p");
    			p4.textContent = "Want to know if you need to bring an umbrella with you? The weather widget provides you with the current weather status as well as a forecast for the next days!";
    			t21 = space();
    			div6 = element("div");
    			header3 = element("header");
    			p5 = element("p");
    			p5.textContent = "Searchbar";
    			t23 = space();
    			main3 = element("main");
    			p6 = element("p");
    			p6.textContent = "Switching between Search Engines can be hard. This widget represents the solution to that! You'll be able to quickly switch the Search Engine and even get suggestions for your search!";
    			t25 = space();
    			section2 = element("section");
    			main6 = element("main");
    			header4 = element("header");
    			h12 = element("h1");
    			h12.textContent = "And lets you customize everything to your preferences";
    			t27 = space();
    			p7 = element("p");
    			p7.textContent = "MyAnimeTab features an easy-to-use settings page. You can install widgets, set their location and most importantly, import your own images.";
    			t29 = space();
    			div7 = element("div");
    			img2 = element("img");
    			t30 = space();
    			section3 = element("section");
    			main8 = element("main");
    			header5 = element("header");
    			h13 = element("h1");
    			h13.textContent = "Get the most out of your Startpage!";
    			t32 = space();
    			main7 = element("main");
    			a4 = element("a");
    			a4.textContent = "Install MyAnimeTab Now!";
    			t34 = space();
    			footer = element("footer");
    			p8 = element("p");
    			p8.textContent = "myanimetab © 2022 aridevelopment.de";
    			attr_dev(img0, "class", "ns navbar_image svelte-eep9tb");
    			if (!src_url_equal(img0.src, img0_src_value = "/icon.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "myanimetab");
    			add_location(img0, file, 3, 35, 97);
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "ns svelte-eep9tb");
    			add_location(a0, file, 3, 12, 74);
    			attr_dev(a1, "href", "/");
    			attr_dev(a1, "class", "ns svelte-eep9tb");
    			add_location(a1, file, 4, 3, 167);
    			attr_dev(div0, "class", "nav_image svelte-eep9tb");
    			add_location(div0, file, 2, 8, 38);
    			attr_dev(a2, "class", "ns svelte-eep9tb");
    			attr_dev(a2, "href", "https://addons.mozilla.org/firefox/addon/myanimetab/");
    			add_location(a2, file, 7, 12, 260);
    			attr_dev(a3, "class", "ns svelte-eep9tb");
    			attr_dev(a3, "href", "https://github.com/aridevelopment-de/myanimetab");
    			add_location(a3, file, 8, 12, 358);
    			attr_dev(div1, "class", "links svelte-eep9tb");
    			add_location(div1, file, 6, 8, 228);
    			attr_dev(nav, "class", "svelte-eep9tb");
    			add_location(nav, file, 1, 1, 24);
    			attr_dev(h10, "class", "pm0 svelte-eep9tb");
    			add_location(h10, file, 13, 3, 501);
    			attr_dev(p0, "class", "svelte-eep9tb");
    			add_location(p0, file, 14, 3, 577);
    			attr_dev(div2, "class", "landing_text svelte-eep9tb");
    			add_location(div2, file, 12, 2, 471);
    			if (!src_url_equal(img1.src, img1_src_value = "/3.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "preview");
    			attr_dev(img1, "class", "svelte-eep9tb");
    			add_location(img1, file, 17, 3, 717);
    			attr_dev(div3, "class", "landing_image svelte-eep9tb");
    			add_location(div3, file, 16, 2, 686);
    			attr_dev(main0, "class", "svelte-eep9tb");
    			add_location(main0, file, 11, 1, 462);
    			attr_dev(section0, "id", "landing");
    			attr_dev(section0, "class", "svelte-eep9tb");
    			add_location(section0, file, 0, 0, 0);
    			attr_dev(h11, "class", "pm0 svelte-eep9tb");
    			add_location(h11, file, 24, 3, 828);
    			attr_dev(header0, "class", "svelte-eep9tb");
    			add_location(header0, file, 23, 2, 816);
    			attr_dev(p1, "class", "pm0 svelte-eep9tb");
    			add_location(p1, file, 29, 5, 955);
    			attr_dev(header1, "class", "svelte-eep9tb");
    			add_location(header1, file, 28, 4, 941);
    			attr_dev(p2, "class", "pm0 svelte-eep9tb");
    			add_location(p2, file, 32, 5, 1010);
    			attr_dev(main1, "class", "svelte-eep9tb");
    			add_location(main1, file, 31, 4, 998);
    			attr_dev(div4, "class", "widget svelte-eep9tb");
    			add_location(div4, file, 27, 3, 916);
    			attr_dev(p3, "class", "pm0 svelte-eep9tb");
    			add_location(p3, file, 37, 5, 1219);
    			attr_dev(header2, "class", "svelte-eep9tb");
    			add_location(header2, file, 36, 4, 1205);
    			attr_dev(p4, "class", "pm0 svelte-eep9tb");
    			add_location(p4, file, 40, 5, 1276);
    			attr_dev(main2, "class", "svelte-eep9tb");
    			add_location(main2, file, 39, 4, 1264);
    			attr_dev(div5, "class", "widget svelte-eep9tb");
    			add_location(div5, file, 35, 3, 1180);
    			attr_dev(p5, "class", "pm0 svelte-eep9tb");
    			add_location(p5, file, 45, 5, 1520);
    			attr_dev(header3, "class", "svelte-eep9tb");
    			add_location(header3, file, 44, 4, 1506);
    			attr_dev(p6, "class", "pm0 svelte-eep9tb");
    			add_location(p6, file, 48, 5, 1579);
    			attr_dev(main3, "class", "svelte-eep9tb");
    			add_location(main3, file, 47, 4, 1567);
    			attr_dev(div6, "class", "widget svelte-eep9tb");
    			add_location(div6, file, 43, 3, 1481);
    			attr_dev(main4, "class", "svelte-eep9tb");
    			add_location(main4, file, 26, 2, 906);
    			attr_dev(main5, "class", "svelte-eep9tb");
    			add_location(main5, file, 22, 1, 807);
    			attr_dev(section1, "id", "widget_list");
    			attr_dev(section1, "class", "svelte-eep9tb");
    			add_location(section1, file, 21, 0, 779);
    			attr_dev(h12, "class", "pm0 svelte-eep9tb");
    			add_location(h12, file, 57, 3, 1888);
    			attr_dev(p7, "class", "svelte-eep9tb");
    			add_location(p7, file, 58, 3, 1966);
    			attr_dev(header4, "class", "svelte-eep9tb");
    			add_location(header4, file, 56, 2, 1876);
    			if (!src_url_equal(img2.src, img2_src_value = "/2.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "preview");
    			attr_dev(img2, "class", "svelte-eep9tb");
    			add_location(img2, file, 61, 3, 2159);
    			attr_dev(div7, "class", "settings_image svelte-eep9tb");
    			add_location(div7, file, 60, 2, 2127);
    			attr_dev(main6, "class", "svelte-eep9tb");
    			add_location(main6, file, 55, 1, 1867);
    			attr_dev(section2, "id", "settings_preview");
    			attr_dev(section2, "class", "svelte-eep9tb");
    			add_location(section2, file, 54, 0, 1834);
    			attr_dev(h13, "class", "svelte-eep9tb");
    			add_location(h13, file, 68, 3, 2266);
    			attr_dev(header5, "class", "svelte-eep9tb");
    			add_location(header5, file, 67, 2, 2254);
    			attr_dev(a4, "href", "https://addons.mozilla.org/firefox/addon/myanimetab/");
    			attr_dev(a4, "class", "svelte-eep9tb");
    			add_location(a4, file, 71, 3, 2335);
    			attr_dev(main7, "class", "svelte-eep9tb");
    			add_location(main7, file, 70, 2, 2325);
    			attr_dev(main8, "class", "svelte-eep9tb");
    			add_location(main8, file, 66, 1, 2245);
    			attr_dev(section3, "id", "install");
    			attr_dev(section3, "class", "svelte-eep9tb");
    			add_location(section3, file, 65, 0, 2221);
    			attr_dev(p8, "class", "svelte-eep9tb");
    			add_location(p8, file, 76, 1, 2466);
    			attr_dev(footer, "class", "svelte-eep9tb");
    			add_location(footer, file, 75, 0, 2456);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section0, anchor);
    			append_dev(section0, nav);
    			append_dev(nav, div0);
    			append_dev(div0, a0);
    			append_dev(a0, img0);
    			append_dev(div0, t0);
    			append_dev(div0, a1);
    			append_dev(nav, t2);
    			append_dev(nav, div1);
    			append_dev(div1, a2);
    			append_dev(div1, t4);
    			append_dev(div1, a3);
    			append_dev(section0, t6);
    			append_dev(section0, main0);
    			append_dev(main0, div2);
    			append_dev(div2, h10);
    			append_dev(div2, t8);
    			append_dev(div2, p0);
    			append_dev(main0, t10);
    			append_dev(main0, div3);
    			append_dev(div3, img1);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, section1, anchor);
    			append_dev(section1, main5);
    			append_dev(main5, header0);
    			append_dev(header0, h11);
    			append_dev(main5, t13);
    			append_dev(main5, main4);
    			append_dev(main4, div4);
    			append_dev(div4, header1);
    			append_dev(header1, p1);
    			append_dev(div4, t15);
    			append_dev(div4, main1);
    			append_dev(main1, p2);
    			append_dev(main4, t17);
    			append_dev(main4, div5);
    			append_dev(div5, header2);
    			append_dev(header2, p3);
    			append_dev(div5, t19);
    			append_dev(div5, main2);
    			append_dev(main2, p4);
    			append_dev(main4, t21);
    			append_dev(main4, div6);
    			append_dev(div6, header3);
    			append_dev(header3, p5);
    			append_dev(div6, t23);
    			append_dev(div6, main3);
    			append_dev(main3, p6);
    			insert_dev(target, t25, anchor);
    			insert_dev(target, section2, anchor);
    			append_dev(section2, main6);
    			append_dev(main6, header4);
    			append_dev(header4, h12);
    			append_dev(header4, t27);
    			append_dev(header4, p7);
    			append_dev(main6, t29);
    			append_dev(main6, div7);
    			append_dev(div7, img2);
    			insert_dev(target, t30, anchor);
    			insert_dev(target, section3, anchor);
    			append_dev(section3, main8);
    			append_dev(main8, header5);
    			append_dev(header5, h13);
    			append_dev(main8, t32);
    			append_dev(main8, main7);
    			append_dev(main7, a4);
    			insert_dev(target, t34, anchor);
    			insert_dev(target, footer, anchor);
    			append_dev(footer, p8);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section0);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(section1);
    			if (detaching) detach_dev(t25);
    			if (detaching) detach_dev(section2);
    			if (detaching) detach_dev(t30);
    			if (detaching) detach_dev(section3);
    			if (detaching) detach_dev(t34);
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
