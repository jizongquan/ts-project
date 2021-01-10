import {
    createStore,
    combineReducers,
    applyMiddleware
} from 'redux';
import {h0} from '../common/fp';
import {
    ORDER_DEPART,
} from './constant';
import thunk from 'redux-thunk';
import reducers from './reducers';
export default createStore(
    combineReducers(reducers),
    {
        from:null,
        to:null,
        departDate: h0(Date.now()),
        highSpeed:false,
        trainList:[],
        orderType:ORDER_DEPART,
        onlyTickets:false,
        //坐席类型
        ticketTypes:[],
        //坐席类型被选中
        checkedTicketTypes:{},
        //车次类型
        trainTypes:[],
        //选中车次类型
        checkedTrainTypes:{},
        //出发车站选项
        departStations:[],
        //出发车站被选中选项
        checkedDepartStations:{},
        //到达车站选项
        arriveStations:[],
        //到达车站被选中选项
        checkedArriveStations:{},
        //出发时间起始点
        departTimeStart:0,
        //出发时间截止点
        departTimeEnd:24,
        //到达时间起始点
        arriveTimeStart:0,
        //到达时间截止点
        arriveTimeEnd:24,
        //综合筛选浮层的显示隐藏
        isFiltersVisible:false,
        //解析地址栏状态，标识解析完成
        searchParsed:false,
    },
    applyMiddleware(thunk)
)