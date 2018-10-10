
const dbDefaultGlobalAnnouncedSignals = {
    'global-announced-signals': {}
};

const addSignals = (dst, src) => {
    let newDst = Object.assign({}, dst);
    for (var key of Object.keys(src)) {
        if (newDst[key] != undefined) {
            newDst[key] += src[key];
            if (newDst[key] == 0)
                delete newDst[key];
        } else if(src[key] != 0)
            newDst[key] = src[key];
    }
    return newDst;
};

const subtractSignals = (dst, src) => {
    let newDst = Object.assign({}, dst);
    for (var key of Object.keys(src)) {
        if (newDst[key] != undefined) {
            newDst[key] -= src[key];
        } else
            newDst[key] = -src[key];
    }
    return newDst;
};

export default { addSignals, subtractSignals };
