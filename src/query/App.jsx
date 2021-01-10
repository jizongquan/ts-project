import React, { useCallback,useEffect, useMemo } from 'react';
import './App.css';
import URI from 'urijs';
import Header from '../common/Header';
import Nav from '../common/Nav';
import List from './List';
import Bottom from './Bottom';
import { connect } from 'react-redux';
import {h0} from "../common/fp";
import dayjs from 'dayjs';
import useNav from '../common/useNav';

import{
    setFrom,
    setTo,
    setDepartDate,
    setHighSpeed,
    setSearchParsed,

    setTrainList,
    setTicketTypes,
    setTrainTypes,
    setDepartStations,
    setArriveStations,

    prevDate,
    nextDate,

    toggleOrderType,
    toggleHighSpeed,
    toggleOnlyTickets,
    toggleIsFiltersVisible,

    setCheckedTicketTypes,
    setCheckedTrainTypes,
    setCheckedDepartStations,
    setCheckedArriveStations,
    setDepartTimeStart,
    setDepartTimeEnd,
    setArriveTimeStart,
    setArriveTimeEnd,
} from './actions';
import { bindActionCreators } from 'redux';

function App(props){
    const {
        trainList,
        from,
        to,
        departDate,
        highSpeed,
        dispatch,
        searchParsed,
        orderType,
        onlyTickets,
        isFiltersVisible,
        //坐席类型
        ticketTypes,
        //车次类型
        trainTypes,
        //出发车站
        departStations,
        //到达车站
        arriveStations,
        checkedTicketTypes,
        checkedTrainTypes,
        checkedDepartStations,
        checkedArriveStations,
        departTimeStart,
        departTimeEnd,
        arriveTimeStart,
        arriveTimeEnd
    } = props;

    const onBack = useCallback(()=>{
        window.history.back();
    },[]);

    // if(!searchParsed){
    //    return null;
    // }

    useEffect(()=>{
        const queries = URI.parseQuery(window.location.search);
        const {
            from,
            to,
            date,
            highSpeed
        } = queries;

        dispatch(setFrom(from));
        dispatch(setTo(to));
        dispatch(setDepartDate(h0(dayjs(date).valueOf())));
        dispatch(setHighSpeed(highSpeed === 'true'));
        dispatch(setSearchParsed(true))
    },[])

    useEffect(()=>{
        if(!searchParsed){
            return;
        }
        const url = new URI('/rest/query')
            .setSearch('from',from)
            .setSearch('to',to)
            .setSearch('date',dayjs(departDate).format('YYYY-MM-DD'))
            .setSearch('highSpeed',highSpeed)
            .setSearch(
                'checkedTicketTypes',
                Object.keys(checkedTicketTypes).join()
            )
            .setSearch(
                'checkedTrainTypes',
                Object.keys(checkedTrainTypes).join()
            )
            .setSearch(
                'checkedDepartStations',
                Object.keys(checkedDepartStations).join()
            )
            .setSearch(
                'checkedArriveStations',
                Object.keys(checkedArriveStations).join()
            )
            .setSearch('departTimeStart', departTimeStart)
            .setSearch('departTimeEnd', departTimeEnd)
            .setSearch('arriveTimeStart', arriveTimeStart)
            .setSearch('arriveTimeEnd', arriveTimeEnd)
            .toString();
            
            fetch(url)
                .then((res)=>{
                    return res.json()
                })
                .then((result)=>{
                    const {
                        dataMap:{
                            directTrainInfo:{
                                trains,
                                filter:{
                                    ticketType,
                                    trainType,
                                    depStation,
                                    arrStation
                                }
                            }
                        }
                    } = result;

                    dispatch(setTrainList(trains));
                    dispatch(setTicketTypes(ticketType));
                    dispatch(setTrainTypes(trainType));
                    dispatch(setDepartStations(depStation));
                    dispatch(setArriveStations(arrStation));
                })

    },[
        searchParsed,
        orderType,
        onlyTickets,
        checkedTicketTypes,
        checkedTrainTypes,
        checkedDepartStations,
        checkedArriveStations,
        departTimeStart,
        departTimeEnd,
        arriveTimeStart,
        arriveTimeEnd,
        from,
        to,
        departDate,
        highSpeed
    ])

    const {
        isPrevDisabled,
        isNextDisabled,
        prev,
        next
    } = useNav(departDate,dispatch,prevDate,nextDate)

    const bottomCbs = useMemo(()=>{
        return bindActionCreators({
            toggleOrderType,
            toggleHighSpeed,
            toggleOnlyTickets,
            toggleIsFiltersVisible,
            setCheckedTicketTypes,
            setCheckedTrainTypes,
            setCheckedDepartStations,
            setCheckedArriveStations,
            setDepartTimeStart,
            setDepartTimeEnd,
            setArriveTimeStart,
            setArriveTimeEnd,
        },dispatch)
    },[])

    if(!searchParsed){
        return null
    }
    return(
        <div>
            <div className="header-wrapper">
                <Header
                    title={`${from} - ${to}`}
                    onBack={onBack}
                />
            </div>
            <Nav
                date={departDate}
                isPrevDisabled={isPrevDisabled}
                isNextDisabled={isNextDisabled}
                prev={prev}
                next={next}
            />
            <List
                list={trainList}
            />
            <Bottom
                highSpeed={highSpeed}
                orderType={orderType}
                onlyTickets={onlyTickets}
                isFiltersVisible={isFiltersVisible}
                ticketTypes={ticketTypes}
                trainTypes={trainTypes}
                departStations={departStations}
                arriveStations={arriveStations}
                checkedTicketTypes={checkedTicketTypes}
                checkedTrainTypes={checkedTrainTypes}
                checkedDepartStations={checkedDepartStations}
                checkedArriveStations={checkedArriveStations}
                departTimeStart={departTimeStart}
                departTimeEnd={departTimeEnd}
                arriveTimeStart={arriveTimeStart}
                arriveTimeEnd={arriveTimeEnd}
                {...bottomCbs}
            />
        </div>
    )
}

export default connect(
    function mapStateToProps(state){
        return state
    },
    function mapDispatchToProps(dispatch){
        return{
            dispatch
        }
    }
)(App);