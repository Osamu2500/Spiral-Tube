export class SpeedBooster extends window.YPP.features.BaseFeature {
    static featureId = 'speedBooster';
    static executionPhase = 'idle';
    static priority = 999;

    constructor() {
        super('SpeedBooster');
    }

    getConfigKey() {
        return 'speedBooster';
    }

    async enable() {
        await super.enable();
        this.injectSpeedScript();
    }

    async disable() {
        await super.disable();
        const script = document.getElementById('ypp-speed-booster-script');
        if (script) script.remove();
        // Disabling it fully requires a page reload since it modifies _yt_player prototype.
    }

    injectSpeedScript() {
        if (document.getElementById('ypp-speed-booster-script')) return;

        const script = document.createElement('script');
        script.id = 'ypp-speed-booster-script';
        script.textContent = `
            (function() {
                var that = this;
                var thatArguments = arguments;
                
                function updateAvailablePlaybackRates() {
                    var path = '';
                    if(typeof _yt_player === "undefined"){ return; }
                    
                    function findAvailablePlaybackRates(objectToSave,prep) {
                        var count=0;
                        for(var i in objectToSave){
                            if(Object.keys(objectToSave)[count] && objectToSave[Object.keys(objectToSave)[count]]){
                                if(Object.keys(objectToSave)[count] == "getAvailablePlaybackRates"){
                                    path = (prep===""?"":prep+".")+Object.keys(objectToSave)[count];
                                } else if(objectToSave[Object.keys(objectToSave)[count]]?.prototype?.getAvailablePlaybackRates !== undefined){
                                    path = (prep===""?"":prep+".")+Object.keys(objectToSave)[count]+".prototype.getAvailablePlaybackRates";
                                }
                                if(path !== '') return;
                                var objOfObj = objectToSave[Object.keys(objectToSave)[count]];
                                if( typeof objOfObj !== "undefined" && objectToSave[i].constructor.name == "Function" && Object.keys(objOfObj).length !== 0 ){
                                    var incount = 0;
                                    for(var j in objOfObj){
                                        if(typeof objOfObj !== "undefined"){
                                            findAvailablePlaybackRates(objOfObj[j],(prep===""?"":prep+".")+Object.keys(objectToSave)[count]+"."+Object.keys(objOfObj)[incount]);
                                        }
                                        if(path !== '') return;
                                        incount++;
                                    }
                                }
                            }
                            count++;
                        }
                    }

                    findAvailablePlaybackRates(_yt_player,"");

                    function setAvailablePlaybackRates(path,index,splitted) {
                        if(splitted.length - 1 == index){
                            path[splitted[index]] = function(){return [0.25,0.5,.75,1,1.25,1.5,1.75,2,2.25,2.5,2.75,3,3.25,3.5,3.75,4,5,6,7,8,9,10]};
                        }else setAvailablePlaybackRates(path[splitted[index]],index+1,splitted);
                    }

                    if(path !== "") setAvailablePlaybackRates(_yt_player,0,path.split('.'));
                }

                function runUpdateAvailablePlaybackRates() {
                    if(typeof _yt_player === "undefined"){
                        var interval = setInterval(function(){
                            if(typeof _yt_player !== "undefined"){
                                clearInterval(interval);
                                updateAvailablePlaybackRates();
                            }
                        },50);
                    }else{
                        updateAvailablePlaybackRates();
                    }
                }

                window.addEventListener('yt-navigate-finish', runUpdateAvailablePlaybackRates);
                runUpdateAvailablePlaybackRates();
            })();
        `;
        document.documentElement.appendChild(script);
    }
};

window.YPP.features.SpeedBooster = SpeedBooster;
