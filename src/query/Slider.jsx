import React,{memo,useMemo,useState,useRef,useEffect} from 'react';
import './Slider.css';
import leftpad from 'left-pad';
import PropTypes from 'prop-types';
import useWinSize from '../common/useWinSize';

const Slider = memo((props)=>{
    const {
        title,
        currentStartHours,
        currentEndHours,
        onStartChanged,
        onEndChanged
    } = props;

    const winSize = useWinSize()

    const startHandle = useRef();
    const endHandle = useRef();

    const lastStartX = useRef();
    const lastEndX = useRef();

    const range = useRef();
    const rangeWidth = useRef();

    const prevCurrentStartHours = useRef(currentStartHours);
    const prevCurrentEndHours = useRef(currentEndHours);

    


    const [start,setStart] = useState(()=>{
        return (currentStartHours/24)*100
    });
    const [end,setEnd] = useState(()=>{
        return (currentEndHours/24)*100
    });

    if(prevCurrentStartHours.current !== currentStartHours){
        setStart(()=>{
            return (currentStartHours/24)*100
        })
        prevCurrentStartHours.current = currentStartHours;
    }

    if(prevCurrentEndHours.current !== currentEndHours){
        setEnd(()=>{
            return (currentEndHours/24)*100
        })
        prevCurrentEndHours.current = currentEndHours;
    }
    const startPercent = useMemo(()=>{
        if(start > 100){
            return 100
        }
        if(start < 0){
            return 0
        }
        return start
    },[start]);
    const endPercent = useMemo(()=>{
        if(end > 100){
            return 100
        }
        if(end < 0){
            return 0
        }
        return end
    },[end]);

    const startHours = useMemo(()=>{
        return Math.round((startPercent * 24) / 100)
    },[startPercent])
    const endHours = useMemo(()=>{
        return Math.round((endPercent * 24) / 100)
    },[endPercent])

    const startText = useMemo(()=>{
        return leftpad(startHours,2,'0') + ':00';
    },[startHours])

    const endText = useMemo(()=>{
        return leftpad(endHours,2,'0') + ':00';
    },[endHours])

    //第一个滑块
    function onStartTouchBegin(e){
        //获取第一个touch点
        const touch = e.targetTouches[0];
        lastStartX.current = touch.pageX;
    }
    //第二个滑块
    function onEndTouchBegin(e){
        //获取第一个touch点
        const touch = e.targetTouches[0];
        lastEndX.current = touch.pageX;
    }

    //左侧滑块touchMove
    function onStartTouchMove(e){
        const touch = e.targetTouches[0];
        const distance = touch.pageX - lastStartX.current;
        lastStartX.current =touch.pageX;

        setStart((start)=>{
            return start + (distance / rangeWidth.current)*100
        })
    }

    //右侧滑块touchMove
    function onEndTouchMove(e){
        const touch = e.targetTouches[0];
        const distance = touch.pageX - lastEndX.current;
        lastEndX.current =touch.pageX;

        setEnd((end)=>{
            return end + (distance / rangeWidth.current)*100
        })
    }

    useEffect(()=>{
        rangeWidth.current = parseFloat(
            window.getComputedStyle(range.current).width
        )
    },[winSize.width])
    // touch事件
    useEffect(()=>{
        startHandle.current.addEventListener(
            'touchstart',
            onStartTouchBegin,
            false
        );
        startHandle.current.addEventListener(
            'touchmove',
            onStartTouchMove,
            false
        );

        endHandle.current.addEventListener(
            'touchstart',
            onEndTouchBegin,
            false
        );
        endHandle.current.addEventListener(
            'touchmove',
            onEndTouchMove,
            false
        );

        return () => {
            startHandle.current.removeEventListener(
                'touchstart',
                onStartTouchBegin,
                false
            );
            startHandle.current.removeEventListener(
                'touchmove',
                onStartTouchMove,
                false
            );
    
            endHandle.current.removeEventListener(
                'touchstart',
                onEndTouchBegin,
                false
            );
            endHandle.current.removeEventListener(
                'touchmove',
                onEndTouchMove,
                false
            );
        }
    })

    useEffect(()=>{
        onStartChanged(startHours)
    },[startHours]);

    useEffect(()=>{
        onEndChanged(endHours)
    },[endHours]);

    return(
        <div className="option">
            <h3>{title}</h3>
            <div className="range-slider">
                <div className="slider" ref={range}>
                    <div className="slider-range" style={{
                        left:startPercent + '%',
                        width:endPercent -startPercent + '%'
                    }}>
                    </div>
                    <i ref={startHandle} className="slider-handle" style={{
                        left:startPercent + '%'
                    }}>
                        <span>{ startText }</span>
                    </i>
                    <i ref={endHandle} className="slider-handle" style={{
                        left:endPercent + '%'
                    }}>
                        <span>{ endText }</span>
                    </i>
                </div>
            </div>
        </div>
    )
})


Slider.propTypes = {
    title: PropTypes.string.isRequired,
    currentStartHours: PropTypes.number.isRequired,
    currentEndHours: PropTypes.number.isRequired,
    onStartChanged: PropTypes.func.isRequired,
    onEndChanged: PropTypes.func.isRequired,
}
export default Slider;
