import React,{memo,useState,useEffect} from 'react';
import './Schedule.css';
import URI from 'urijs';
import dayjs from 'dayjs';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import leftPad from 'left-pad';

const ScheduleRow = memo((props)=>{
    const {
        index,
        station,
        arriveTime,
        departTime,
        stay,

        isStartStation,
        isEndStation,
        isDepartStation,
        isArriveStation,
        beforeDepartStation,
        afterArriveStation,
    } =props;
    const iconClass = classnames('icon',{
        'icon-red':isDepartStation || isArriveStation
    })
    const rowClass = classnames('row',{
        'grey': beforeDepartStation || afterArriveStation
    })
    const stationClass =  classnames('station',{
        'red': isArriveStation || isDepartStation
    })
    const arrtimeClass = classnames('arrtime',{
        'red':isArriveStation 
    })
    const deptimeClass = classnames('deptime',{
        'red':isDepartStation 
    })
    return(
        <li>
            <div className={iconClass}>
                {
                    isDepartStation?'出': isArriveStation?'到':leftPad(index,2,0)
                }
            </div>
            <div className={rowClass}>
                <span className={stationClass}>{station}</span>
                <span className={arrtimeClass}>
                    { isArriveStation ? '始发站' : arriveTime }
                </span>
                <span className={deptimeClass}>
                    { isEndStation ? '终到站' : departTime }
                </span>
                <span className="stoptime">
                    { isStartStation || isEndStation ? '-' : stay + '分' }
                </span>
            </div>
        </li>
    )
})

const Schedule = memo((props)=>{
    const { date, trainNumber, departStation, arriveStation } = props;

    const [scheduleList,setScheduleList] = useState([])

    useEffect(()=>{
        const url = new URI('/rest/schedule')
            .setSearch('trainNumber', trainNumber)
            .setSearch('departStation', departStation)
            .setSearch('arriveStation', arriveStation)
            .setSearch('date', dayjs(date).format('YYYY-MM-DD'))
            .toString();

            fetch(url)
                .then((res)=>{
                    return res.json()
                })
                .then((data)=>{
                    //出发车站
                    let departRow;
                    //到达车站
                    let arriveRow;

                    for(let i=0;i<data.length;i++){
                        if(!departRow){
                            if(data[i].station === departStation){
                                departRow = Object.assign(data[i],{
                                    beforeDepartStation: false,
                                    isDepartStation: true,
                                    afterArriveStation: false,
                                    isArriveStation: false,
                                })
                            }else{
                                Object.assign(data[i], {
                                    beforeDepartStation: true,
                                    isDepartStation: false,
                                    afterArriveStation: false,
                                    isArriveStation: false,
                                });
                            }
                        }else if (!arriveRow) {
                            if (data[i].station === arriveStation) {
                                arriveRow = Object.assign(data[i], {
                                    beforeDepartStation: false,
                                    isDepartStation: false,
                                    afterArriveStation: false,
                                    isArriveStation: true,
                                });
                            } else {
                                Object.assign(data[i], {
                                    beforeDepartStation: false,
                                    isDepartStation: false,
                                    afterArriveStation: false,
                                    isArriveStation: false,
                                });
                            }
                        } else {
                            Object.assign(data[i], {
                                beforeDepartStation: false,
                                isDepartStation: false,
                                afterArriveStation: true,
                                isArriveStation: false,
                            });
                        }

                        Object.assign(data[i], {
                            isStartStation: i === 0,
                            isEndStation: i === data.length - 1,
                        });
                    }
                    setScheduleList(data);
                })
        

    },[date,trainNumber,departStation,arriveStation])
    return(
        <div className="schedule">
            <div className="dialog">
                <h1>列车时刻表</h1>
                <div className="head">
                    <span className="station">车站</span>
                    <span className="deptime">到达</span>
                    <span className="arrtime">发车</span>
                    <span className="stoptime">停留时间</span>
                </div>
                <ul>
                    {scheduleList.map((schedule, index) => {
                        return (
                            <ScheduleRow
                                key={schedule.station}
                                index={index + 1}
                                {...schedule}
                            />
                        );
                    })}
                </ul>
            </div>
        </div>
    )
})
Schedule.propTypes = {
    date: PropTypes.number.isRequired,
    trainNumber: PropTypes.string.isRequired,
    departStation: PropTypes.string.isRequired,
    arriveStation: PropTypes.string.isRequired,
};

export default Schedule;