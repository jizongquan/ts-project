export function h0(timestamp = Date.now()){
    //去掉分钟、秒、毫秒
    const target = new Date(timestamp)

    target.setHours(0);
    target.setMinutes(0);
    target.setSeconds(0);
    target.setMilliseconds(0);

    return target.getTime();

}