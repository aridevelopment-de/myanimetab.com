
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
    let outros;
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
    function create_component(block) {
        block && block.c();
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
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
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

    /* src\components\Navbar.svelte generated by Svelte v3.47.0 */

    const file$6 = "src\\components\\Navbar.svelte";

    function create_fragment$6(ctx) {
    	let nav;
    	let div0;
    	let a0;
    	let img;
    	let img_src_value;
    	let t0;
    	let a1;
    	let t2;
    	let div1;
    	let a2;
    	let t4;
    	let a3;
    	let t6;
    	let a4;

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div0 = element("div");
    			a0 = element("a");
    			img = element("img");
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
    			a4 = element("a");
    			a4.textContent = "Discord";
    			attr_dev(img, "class", "navbar_image svelte-qdsj7h");
    			if (!src_url_equal(img.src, img_src_value = "./icon.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "myanimetab");
    			add_location(img, file$6, 2, 21, 57);
    			attr_dev(a0, "href", "./");
    			attr_dev(a0, "class", "svelte-qdsj7h");
    			add_location(a0, file$6, 2, 8, 44);
    			attr_dev(a1, "href", "./");
    			attr_dev(a1, "class", "svelte-qdsj7h");
    			add_location(a1, file$6, 3, 8, 131);
    			attr_dev(div0, "class", "nav_image svelte-qdsj7h");
    			add_location(div0, file$6, 1, 4, 11);
    			attr_dev(a2, "href", "https://addons.mozilla.org/firefox/addon/myanimetab/");
    			attr_dev(a2, "class", "svelte-qdsj7h");
    			add_location(a2, file$6, 6, 8, 205);
    			attr_dev(a3, "href", "https://github.com/aridevelopment-de/myanimetab");
    			attr_dev(a3, "class", "svelte-qdsj7h");
    			add_location(a3, file$6, 7, 8, 289);
    			attr_dev(a4, "href", "https://aridevelopment.de/dc");
    			attr_dev(a4, "class", "svelte-qdsj7h");
    			add_location(a4, file$6, 8, 2, 361);
    			attr_dev(div1, "class", "links svelte-qdsj7h");
    			add_location(div1, file$6, 5, 4, 176);
    			attr_dev(nav, "class", "svelte-qdsj7h");
    			add_location(nav, file$6, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div0);
    			append_dev(div0, a0);
    			append_dev(a0, img);
    			append_dev(div0, t0);
    			append_dev(div0, a1);
    			append_dev(nav, t2);
    			append_dev(nav, div1);
    			append_dev(div1, a2);
    			append_dev(div1, t4);
    			append_dev(div1, a3);
    			append_dev(div1, t6);
    			append_dev(div1, a4);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\components\LandingSection.svelte generated by Svelte v3.47.0 */
    const file$5 = "src\\components\\LandingSection.svelte";

    function create_fragment$5(ctx) {
    	let section;
    	let navbar;
    	let t0;
    	let main;
    	let div0;
    	let h1;
    	let t2;
    	let p;
    	let t4;
    	let div1;
    	let img;
    	let img_src_value;
    	let current;
    	navbar = new Navbar({ $$inline: true });

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			main = element("main");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "MyAnimeTab - A Firefox Startpage for Anime Enjoyers";
    			t2 = space();
    			p = element("p");
    			p.textContent = "MyAnimeTab is a Firefox addon that replaces the default Startpage with a customizable one.";
    			t4 = space();
    			div1 = element("div");
    			img = element("img");
    			attr_dev(h1, "class", "pm0 svelte-11n01gp");
    			add_location(h1, file$5, 7, 3, 130);
    			attr_dev(p, "class", "svelte-11n01gp");
    			add_location(p, file$5, 8, 3, 207);
    			attr_dev(div0, "class", "landing_text svelte-11n01gp");
    			add_location(div0, file$5, 6, 2, 99);
    			if (!src_url_equal(img.src, img_src_value = "./3.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "preview");
    			attr_dev(img, "class", "svelte-11n01gp");
    			add_location(img, file$5, 11, 3, 350);
    			attr_dev(div1, "class", "landing_image svelte-11n01gp");
    			add_location(div1, file$5, 10, 2, 318);
    			attr_dev(main, "class", "svelte-11n01gp");
    			add_location(main, file$5, 5, 1, 89);
    			attr_dev(section, "class", "svelte-11n01gp");
    			add_location(section, file$5, 3, 0, 64);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(navbar, section, null);
    			append_dev(section, t0);
    			append_dev(section, main);
    			append_dev(main, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t2);
    			append_dev(div0, p);
    			append_dev(main, t4);
    			append_dev(main, div1);
    			append_dev(div1, img);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(navbar);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LandingSection', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LandingSection> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Navbar });
    	return [];
    }

    class LandingSection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LandingSection",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\components\Widget.svelte generated by Svelte v3.47.0 */

    const file$4 = "src\\components\\Widget.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let header;
    	let p0;
    	let t0;
    	let t1;
    	let main;
    	let p1;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			header = element("header");
    			p0 = element("p");
    			t0 = text(/*name*/ ctx[0]);
    			t1 = space();
    			main = element("main");
    			p1 = element("p");
    			t2 = text(/*description*/ ctx[1]);
    			attr_dev(p0, "class", "pm0 svelte-1olmg8o");
    			add_location(p0, file$4, 6, 8, 101);
    			attr_dev(header, "class", "svelte-1olmg8o");
    			add_location(header, file$4, 5, 4, 83);
    			attr_dev(p1, "class", "pm0 svelte-1olmg8o");
    			add_location(p1, file$4, 9, 8, 163);
    			attr_dev(main, "class", "svelte-1olmg8o");
    			add_location(main, file$4, 8, 4, 147);
    			attr_dev(div, "class", "svelte-1olmg8o");
    			add_location(div, file$4, 4, 0, 72);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, header);
    			append_dev(header, p0);
    			append_dev(p0, t0);
    			append_dev(div, t1);
    			append_dev(div, main);
    			append_dev(main, p1);
    			append_dev(p1, t2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1) set_data_dev(t0, /*name*/ ctx[0]);
    			if (dirty & /*description*/ 2) set_data_dev(t2, /*description*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Widget', slots, []);
    	let { name } = $$props;
    	let { description } = $$props;
    	const writable_props = ['name', 'description'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Widget> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('description' in $$props) $$invalidate(1, description = $$props.description);
    	};

    	$$self.$capture_state = () => ({ name, description });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('description' in $$props) $$invalidate(1, description = $$props.description);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, description];
    }

    class Widget extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { name: 0, description: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Widget",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<Widget> was created without expected prop 'name'");
    		}

    		if (/*description*/ ctx[1] === undefined && !('description' in props)) {
    			console.warn("<Widget> was created without expected prop 'description'");
    		}
    	}

    	get name() {
    		throw new Error("<Widget>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Widget>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<Widget>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<Widget>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\WidgetListSection.svelte generated by Svelte v3.47.0 */
    const file$3 = "src\\components\\WidgetListSection.svelte";

    function create_fragment$3(ctx) {
    	let section;
    	let main;
    	let header;
    	let h1;
    	let t1;
    	let div;
    	let widget0;
    	let t2;
    	let widget1;
    	let t3;
    	let widget2;
    	let current;

    	widget0 = new Widget({
    			props: {
    				name: "Clock",
    				description: "A simple yet powerful clock. It displays the current time but also enables setting alarms. Great to keep track of your pizza!"
    			},
    			$$inline: true
    		});

    	widget1 = new Widget({
    			props: {
    				name: "Weather",
    				description: "Want to know if you need to bring an umbrella with you? The weather widget provides you with the current weather status as well as a forecast for the next days!"
    			},
    			$$inline: true
    		});

    	widget2 = new Widget({
    			props: {
    				name: "Searchbar",
    				description: "Switching between Search Engines can be hard. This widget represents the solution to that! You'll be able to quickly switch the Search Engine and even get suggestions for your search!"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			main = element("main");
    			header = element("header");
    			h1 = element("h1");
    			h1.textContent = "It comes with a wide collection of widgets";
    			t1 = space();
    			div = element("div");
    			create_component(widget0.$$.fragment);
    			t2 = space();
    			create_component(widget1.$$.fragment);
    			t3 = space();
    			create_component(widget2.$$.fragment);
    			attr_dev(h1, "class", "pm0 svelte-kyahl");
    			add_location(h1, file$3, 6, 3, 96);
    			attr_dev(header, "class", "svelte-kyahl");
    			add_location(header, file$3, 5, 2, 83);
    			attr_dev(div, "class", "widget_list svelte-kyahl");
    			add_location(div, file$3, 8, 2, 176);
    			attr_dev(main, "class", "svelte-kyahl");
    			add_location(main, file$3, 4, 1, 73);
    			attr_dev(section, "class", "svelte-kyahl");
    			add_location(section, file$3, 3, 0, 61);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, main);
    			append_dev(main, header);
    			append_dev(header, h1);
    			append_dev(main, t1);
    			append_dev(main, div);
    			mount_component(widget0, div, null);
    			append_dev(div, t2);
    			mount_component(widget1, div, null);
    			append_dev(div, t3);
    			mount_component(widget2, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(widget0.$$.fragment, local);
    			transition_in(widget1.$$.fragment, local);
    			transition_in(widget2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(widget0.$$.fragment, local);
    			transition_out(widget1.$$.fragment, local);
    			transition_out(widget2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(widget0);
    			destroy_component(widget1);
    			destroy_component(widget2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('WidgetListSection', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<WidgetListSection> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Widget });
    	return [];
    }

    class WidgetListSection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WidgetListSection",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\SettingsPreviewSection.svelte generated by Svelte v3.47.0 */

    const file$2 = "src\\components\\SettingsPreviewSection.svelte";

    function create_fragment$2(ctx) {
    	let section;
    	let main;
    	let header;
    	let h1;
    	let t1;
    	let p;
    	let t3;
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			section = element("section");
    			main = element("main");
    			header = element("header");
    			h1 = element("h1");
    			h1.textContent = "And lets you customize everything to your preferences";
    			t1 = space();
    			p = element("p");
    			p.textContent = "MyAnimeTab features an easy-to-use settings page. You can install widgets, set their location and most importantly, import your own images.";
    			t3 = space();
    			div = element("div");
    			img = element("img");
    			attr_dev(h1, "class", "pm0 svelte-qg7o7p");
    			add_location(h1, file$2, 3, 3, 35);
    			attr_dev(p, "class", "svelte-qg7o7p");
    			add_location(p, file$2, 4, 3, 114);
    			attr_dev(header, "class", "svelte-qg7o7p");
    			add_location(header, file$2, 2, 2, 22);
    			if (!src_url_equal(img.src, img_src_value = "./2.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "preview");
    			attr_dev(img, "class", "svelte-qg7o7p");
    			add_location(img, file$2, 7, 3, 310);
    			attr_dev(div, "class", "settings_image");
    			add_location(div, file$2, 6, 2, 277);
    			attr_dev(main, "class", "svelte-qg7o7p");
    			add_location(main, file$2, 1, 1, 12);
    			attr_dev(section, "class", "svelte-qg7o7p");
    			add_location(section, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, main);
    			append_dev(main, header);
    			append_dev(header, h1);
    			append_dev(header, t1);
    			append_dev(header, p);
    			append_dev(main, t3);
    			append_dev(main, div);
    			append_dev(div, img);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SettingsPreviewSection', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SettingsPreviewSection> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class SettingsPreviewSection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SettingsPreviewSection",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\InstallSection.svelte generated by Svelte v3.47.0 */

    const file$1 = "src\\components\\InstallSection.svelte";

    function create_fragment$1(ctx) {
    	let section;
    	let main;
    	let header;
    	let h1;
    	let t1;
    	let div;
    	let a;

    	const block = {
    		c: function create() {
    			section = element("section");
    			main = element("main");
    			header = element("header");
    			h1 = element("h1");
    			h1.textContent = "Get the most out of your Startpage!";
    			t1 = space();
    			div = element("div");
    			a = element("a");
    			a.textContent = "Install MyAnimeTab Now!";
    			attr_dev(h1, "class", "svelte-cokbwy");
    			add_location(h1, file$1, 3, 3, 35);
    			add_location(header, file$1, 2, 2, 22);
    			attr_dev(a, "href", "https://addons.mozilla.org/firefox/addon/myanimetab/");
    			attr_dev(a, "class", "svelte-cokbwy");
    			add_location(a, file$1, 6, 3, 131);
    			attr_dev(div, "class", "button_container svelte-cokbwy");
    			add_location(div, file$1, 5, 2, 96);
    			add_location(main, file$1, 1, 1, 12);
    			attr_dev(section, "class", "svelte-cokbwy");
    			add_location(section, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, main);
    			append_dev(main, header);
    			append_dev(header, h1);
    			append_dev(main, t1);
    			append_dev(main, div);
    			append_dev(div, a);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InstallSection', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InstallSection> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class InstallSection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InstallSection",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.47.0 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let landingsection;
    	let t0;
    	let widgetlistsection;
    	let t1;
    	let settingspreviewsection;
    	let t2;
    	let installsection;
    	let t3;
    	let footer;
    	let p;
    	let current;
    	landingsection = new LandingSection({ $$inline: true });
    	widgetlistsection = new WidgetListSection({ $$inline: true });
    	settingspreviewsection = new SettingsPreviewSection({ $$inline: true });
    	installsection = new InstallSection({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(landingsection.$$.fragment);
    			t0 = space();
    			create_component(widgetlistsection.$$.fragment);
    			t1 = space();
    			create_component(settingspreviewsection.$$.fragment);
    			t2 = space();
    			create_component(installsection.$$.fragment);
    			t3 = space();
    			footer = element("footer");
    			p = element("p");
    			p.textContent = "myanimetab © 2022 aridevelopment.de";
    			attr_dev(p, "class", "svelte-1alkfek");
    			add_location(p, file, 11, 1, 413);
    			attr_dev(footer, "class", "svelte-1alkfek");
    			add_location(footer, file, 10, 0, 402);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(landingsection, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(widgetlistsection, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(settingspreviewsection, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(installsection, target, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, footer, anchor);
    			append_dev(footer, p);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(landingsection.$$.fragment, local);
    			transition_in(widgetlistsection.$$.fragment, local);
    			transition_in(settingspreviewsection.$$.fragment, local);
    			transition_in(installsection.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(landingsection.$$.fragment, local);
    			transition_out(widgetlistsection.$$.fragment, local);
    			transition_out(settingspreviewsection.$$.fragment, local);
    			transition_out(installsection.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(landingsection, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(widgetlistsection, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(settingspreviewsection, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(installsection, detaching);
    			if (detaching) detach_dev(t3);
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

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		LandingSection,
    		WidgetListSection,
    		SettingsPreviewSection,
    		InstallSection
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
