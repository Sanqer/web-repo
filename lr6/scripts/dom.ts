export default class Dom {
    static select<T extends Element>(selector: string) : T {
        let element = document.querySelector<T>(selector);
        if (element == null) {
            throw new Error('there is no element matching selector = ' + selector);
        }
        return element;
    }
}