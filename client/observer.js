export class Observer
{
    constructor(element, callback)
    {
        this.element = element;
        this.callback = callback;
        this.observer = null;
        this.options = undefined;
    }
    start()
    {
        if (this.element)
        {
            this.observer = new MutationObserver(this.callback);
            this.observer.observe(this.element, this.options);
        }
        return this;
    }
    stop()
    {
        this.observer && this.observer.disconnect();
        return this;
    }
    static observe(selector, callback, options)
    {
        callback([]);
        return [...document.querySelectorAll(selector)].map(
            it =>
            {
                const observer = new Observer(it, callback);
                observer.options = options;
                return observer.start();
            });
    }
    static childList(selector, callback)
    {
        return Observer.observe(selector, callback, {
            childList: true,
            subtree: false,
            attributes: false,
        });
    }
    static childListSubtree(selector, callback)
    {
        return Observer.observe(selector, callback, {
            childList: true,
            subtree: true,
            attributes: false,
        });
    }
    static attributes(selector, callback)
    {
        return Observer.observe(selector, callback, {
            childList: false,
            subtree: false,
            attributes: true,
        });
    }
    static attributesSubtree(selector, callback)
    {
        return Observer.observe(selector, callback, {
            childList: false,
            subtree: true,
            attributes: true,
        });
    }
    static all(selector, callback)
    {
        return Observer.observe(selector, callback, {
            childList: true,
            subtree: true,
            attributes: true,
        });
    }
    static async videoChange(callback)
    {
        const player = await SpinQuery.select(() => document.querySelector("#bilibiliPlayer"));
        if (player === null)
        {
            return null;
        }
        return Observer.childList("#bofqi,#bilibiliPlayer", records =>
        {
            const isMenuAttached = records.length > 0 && records.every(it => [...it.addedNodes].some(e => e.classList && e.classList.contains("bilibili-player-context-menu-container")));
            if (!isMenuAttached)
            {
                callback(records);
            }
        });
    }
}