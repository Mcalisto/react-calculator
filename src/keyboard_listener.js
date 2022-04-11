function keyboardListener(document){
    let observers = [];

    document.addEventListener("keydown", handleKey, false);

    function subscribe(injected_function){
        observers.push(injected_function);
    }

    function handleKey(event){
        const key = event.key;
        notifyObservers(key);
    }

    function notifyObservers(e){
        for(let i=0; i<observers.length; i++){
            observers[i](e);
        }
    }

    return {subscribe}
}

export default keyboardListener;