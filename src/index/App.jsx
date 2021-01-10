import {connect} from 'react-redux';
import React,{useCallback,useMemo} from 'react';
//批量操作bindActionCreators callback集合
import { bindActionCreators } from 'redux';
import "./App.css";

import Header from '../common/Header.jsx';
import DepartDate from './DepartDate.jsx';
import HighSpeed from './HighSpeed.jsx';
import Journey from './Journey.jsx';
import Submit from './Submit.jsx';

import CitySelector from '../common/CitySelector';
import DateSelector from '../common/DateSelector';
import {
    exchangeFromTo,
    showCitySelector,
    hideCitySelector,
    fetchCityData,
    setSelectedCity,
    setDepartDate,
    showDateSelector,
    hideDateSelector,
    toggleHighSpeed
} from './actions';
import { h0 } from '../common/fp';

function App(props){
    const {
        from,
        to,
        dispatch,
        isCitySelectorVisible,
        isDateSelectorVisible,
        cityData,
        isLoadingCityData,
        departDate,
        highSpeed
    } =props;
    const onBack = useCallback(()=>{
        window.History.back();
    },[])
    // 下面等同于下面的cbs，同样可以传exchangeFromTo ={doExchangeFromTo}，
    // showCitySelector={doShowCitySelector}
    // const doExchangeFromTo = useCallback(()=>{
    //     dispatch(exchangeFromTo())
    // },[])
    // const doShowCitySelector = useCallback((m)=>{
    //     dispatch(showCitySelector(m))
    // },[])

    const cbs = useMemo(()=>{
        return bindActionCreators({
            exchangeFromTo,
            showCitySelector
        },dispatch)
    },[])

    const citySelectorCbs = useMemo(()=>{
        return bindActionCreators({
            onBack:hideCitySelector,
            fetchCityData,
            onSelect:setSelectedCity
        },dispatch)
    },[])

    const departDateCbs = useMemo(()=>{
        return bindActionCreators({
            onClick:showDateSelector
        },dispatch)
    },[])
    const dateSelectorCbs = useMemo(()=>{
        return bindActionCreators({
            onBack:hideDateSelector
        },dispatch);
    },[])

    const highSpeedCbs = useMemo(()=>{
        return bindActionCreators({
            toggle:toggleHighSpeed
        },dispatch)
    },[])

    const onSelectDate = useCallback((day)=>{
        //判断day是否存在
        if(!day){
            return;
        }
        //判断是否为过去日期
        if(day < h0()){
            return
        }

        dispatch(setDepartDate(day));
        dispatch(hideDateSelector());
    },[])

    return(
        <div>
            <div className="header-wrapper">
                <Header title="火车票" onBack={onBack}/>
            </div>
            <form action="./query.html" className="form">
                <Journey
                    from={from}
                    to={to}
                    {...cbs}
                />
                <DepartDate
                    time={departDate}
                    {...departDateCbs}
                />
                <HighSpeed
                    highSpeed={highSpeed}
                    {...highSpeedCbs}
                />
                <Submit/>
            </form>
            <CitySelector 
                show={isCitySelectorVisible}
                cityData={cityData}
                isLoading={isLoadingCityData}
                {...citySelectorCbs}
            />
            <DateSelector
                show={isDateSelectorVisible}
                {...dateSelectorCbs}
                onSelect ={ onSelectDate }
            />
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