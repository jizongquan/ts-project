import {
    createStore,
    combineReducers,
    applyMiddleware
} from 'redux'

import reducers from './reducers';
import  thunk from 'redux-thunk';

export default createStore(
    combineReducers(reducers),
    {
        from:"北京",
        to:"上海",
        //是否选择城市的浮层
        isCitySelectorVisible:false,
        //选择完后中间状态
        currentSelectingLeftCity:false,
        cityData:null,
        //加载的时候的loading
        isLoadingCityData:false,
        //是否选择日期的浮层
        isDateSelectorVisible:false,
        //是否选择高铁动车
        highSpeed:false,
        //默认时间
        departDate:Date.now(),
    },
    applyMiddleware(thunk)
);