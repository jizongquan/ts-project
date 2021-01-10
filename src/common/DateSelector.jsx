import React from 'react';
import Proptypes from 'prop-types';
import classnames from 'classnames';

import { h0 } from '../common/fp';
import Header from './Header.jsx';

import './DateSelector.css';

function Day(props){
    const { 
        day,
        onSelect
    } = props;

    if(!day){
        return <td className="null"></td>;
    }

    const classess = [];

    const now = h0();
    if(day<now){
        classess.push('disabled');
    }
    if([6,0].includes(new Date(day).getDay())){
        classess.push('weekend');
    }

    const dateString = now === day ? '今天': new Date(day).getDate()

    const includeClasses = classnames(classess)

    return(
        <td className={includeClasses} onClick={()=>{onSelect(day)}}>
            { dateString }
        </td>
    )
}

Day.propTypes = {
    day:Proptypes.number,
    onSelect:Proptypes.func.isRequired,
}

function Week(props){
    const {
        days,
        onSelect
    } = props;
    return(
        <tr className="date-table-days">
            {
                days.map((day,idx)=>{
                    return(
                        <Day
                            key={idx}
                            day={day}
                            onSelect={onSelect}
                        />
                    )
                })
            }
        </tr>
    )
}

Week.propTypes = {
    days:Proptypes.array.isRequired,
    onSelect:Proptypes.func.isRequired,
}

function Month(props){
    const {
        //每个月第一天的零时零分零秒
        startingTimeInMonth,
        onSelect,
    } = props;

    const startDay = new Date(startingTimeInMonth);
    const currentDay = new Date(startingTimeInMonth);

    let days = [];
    while(currentDay.getMonth() === startDay.getMonth()){
        days.push(currentDay.getTime());
        currentDay.setDate(currentDay.getDate() + 1);
    }
    //补齐对应日期的空白出
    // 补齐前面
    days = new Array(startDay.getDay() ? startDay.getDay() - 1: 6)
            .fill(null).concat(days);
    //补齐后面 
    const lastDay = new Date(days[days.length - 1]);
    days = days.concat(new Array(lastDay.getDay()? 7 - lastDay.getDay() : 0)
            .fill(null));

    const weeks = [];
    for(let row = 0;row < days.length / 7; row++){
        const week = days.slice(row*7,(row+1)*7);
        weeks.push(week);
    }

    return(
        <table className="date-table">
            <thead>
                <tr>
                    <td colSpan="7">
                        <h5>
                            {startDay.getFullYear()}年
                            {startDay.getMonth() + 1}月
                        </h5>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr className="data-table-weeks">
                    <th>周一</th>
                    <th>周二</th>
                    <th>周三</th>
                    <th>周四</th>
                    <th>周五</th>
                    <th className="weekend">周六</th>
                    <th className="weekend">周日</th>
                </tr>
                {
                    weeks.map((week,idx)=>{
                        return(
                            <Week
                                key={idx}
                                days={week}
                                onSelect={onSelect}
                            />
                        )
                    })
                }
            </tbody>
        </table>
    )
}

Month.propTypes = {
    startingTimeInMonth:Proptypes.number.isRequired,
    onSelect:Proptypes.func.isRequired,
}

export default function DateSelector(props){
    const {
        show,
        onSelect,
        onBack,
    } = props;
    const now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    //重置为当前的1号
    now.setDate(1);
    const monthSequence = [now.getTime()];

    //设置未来一个月的，这样避免了 每个月日子不统一的问题
    now.setMonth(now.getMonth() + 1);
    //获取下个月的0时刻
    monthSequence.push(now.getTime());

    //重复操作
    now.setMonth(now.getMonth() + 1);
    monthSequence.push(now.getTime());

    const classes = classnames('date-selector',{
        hidden:!show
    })
    return(
        <div className={classes}>
            <Header
                title="日期选择"
                onBack={onBack}
            />
            <div className="date-selector-tables">
                {
                    monthSequence.map((month) =>{
                        return(
                            <Month
                                key={month}
                                startingTimeInMonth={month}
                                onSelect={onSelect}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}
DateSelector.propTypes = {
    show:Proptypes.bool.isRequired,
    onSelect:Proptypes.func.isRequired,
    onBack:Proptypes.func.isRequired,
}