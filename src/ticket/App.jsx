import React,{
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useMemo
} from 'react';
import URI from 'urijs';
import Detail from '../common/Detail';
import Candidate from './Candidate';
// import Schedule from './Schedule';
import useNav from '../common/useNav';
import Header from '../common/Header';
import Nav from '../common/Nav';
import {h0} from '../common/fp';
import dayjs from 'dayjs';
import './App.css';
import { connect } from 'react-redux';
import {TrainContext} from './context';

import {
    setDepartStation,
    setArriveStation,
    setTrainNumber,
    setDepartDate,
    setSearchParsed,
    prevDate,
    nextDate,

    setDepartTimeStr,
    setArriveTimeStr,
    setArriveDate,
    setDurationStr,
    setTickets,

    toggleIsScheduleVisible,
} from './actions';
import { bindActionCreators } from 'redux';
//异步引入如下
const Schedule =lazy(()=>{
    return import('./Schedule')
})

function App(props){
    const {
        departDate,
        arriveDate,
        departTimeStr,
        arriveTimeStr,
        departStation,
        arriveStation,
        trainNumber,
        durationStr,
        tickets,
        isScheduleVisible,
        searchParsed,

        dispatch,
    } = props;

    const onBack = useCallback(()=>{
        window.history.back();   
    },[])
    useEffect(()=>{
        const quries = URI.parseQuery(window.location.search);
        const {
            aStation,
            dStation,
            date,
            trainNumber               
        } = quries;

        dispatch(setDepartStation(dStation))
        dispatch(setArriveStation(aStation))
        dispatch(setTrainNumber(trainNumber))
        // dayjs().valueOf()转换成时间戳
        dispatch(setDepartDate(h0(dayjs(date).valueOf())))

        dispatch(setSearchParsed(true));
    },[])

    useEffect(()=>{
        document.title = trainNumber;
    },[trainNumber])

    useEffect(()=>{
        if(!searchParsed){
            return;
        }
        const uri = new URI('/rest/ticket')
        .setSearch('date',dayjs(departDate).format('YYYY-MM-DD'))
        .setSearch('trainNumber',trainNumber)
        .toString()
        fetch(uri)
        .then((res)=>{
            return res.json()
        })
        .then((result)=>{
            const {
                detail,
                candidates
            } = result;

            const {
                departTimeStr,
                arriveTimeStr,
                arriveDate,
                durationStr,
            } = detail;

            dispatch(setDepartTimeStr(departTimeStr));
            dispatch(setArriveTimeStr(arriveTimeStr));
            dispatch(setArriveDate(arriveDate));
            dispatch(setDurationStr(durationStr));
            dispatch(setTickets(candidates));
        })
    },[searchParsed,departDate,trainNumber])

    const {
        isPrevDisabled,
        isNextDisabled,
        prev,
        next,
    } = useNav(departDate,dispatch,prevDate,nextDate);

    const detailCbs = useMemo(()=>{
        return bindActionCreators({
            toggleIsScheduleVisible
        },dispatch)
    },[])

    if(!searchParsed){
        return null;
    }

    return(
        <div className="app">
            <div className="header-wrapper">
                <Header
                    title={trainNumber}
                    onBack={onBack}
                />
            </div>
            <div className="nav-wrapper">
                <Nav
                    date={departDate}
                    isPrevDisabled={isPrevDisabled}
                    isNextDisabled={isNextDisabled}
                    prev={prev}
                    next={next}
                />
            </div>
            <div className="detail-wrapper">
                <Detail
                    departDate={departDate}
                    arriveDate={arriveDate}
                    departTimeStr={departTimeStr}
                    arriveTimeStr={arriveTimeStr}
                    trainNumber={trainNumber}
                    departStation={departStation}
                    arriveStation={arriveStation}
                    durationStr={durationStr}
                >
                    <span className="left"></span>
                    <span className="schedule"
                    onClick={()=>{detailCbs.toggleIsScheduleVisible()}}>时刻表</span>
                    <span className="right"></span>
                </Detail>
            </div>
            <TrainContext.Provider 
                value={{ 
                    trainNumber,
                    departStation,
                    arriveStation,
                    departDate
                }}>
                <Candidate tickets={tickets} />
            </TrainContext.Provider>
            {
                isScheduleVisible &&
                <div className="mask"
                onClick={()=>{dispatch(toggleIsScheduleVisible())}}>
                    <Suspense fallback={<div>loading</div>}>
                        <Schedule
                            date={departDate}
                            trainNumber={trainNumber}
                            departStation={departStation}
                            arriveStation={arriveStation}
                        />
                    </Suspense>
                </div>
            }
            
            
        </div>
    )
}

export default connect(
    function mapStateToProps(state){
        return state
    },
    function mapDispatchToProps(dispatch){
        return {dispatch}
    }
)(App);