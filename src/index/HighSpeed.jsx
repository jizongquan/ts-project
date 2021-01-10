import React from 'react';
import classnames from 'classnames';
import PropeTypes from 'prop-types';
import './HighSpeed.css';

export default function HighSpeed(props){
    const {
        highSpeed,
        toggle,
    } = props;
    const classes = classnames('high-speed-track',{
        checked:highSpeed
    });
    const spanClassess = classnames('high-speed-handle',{
        checked:highSpeed
    })
    return(
        <div className="high-speed">
            <div className="high-speed-label">只看高铁/动车</div>
            <div className="high-speed-switch" onClick={()=>{toggle()}}>
                <input type="hidden" name="highSpeed" value={highSpeed}/>
                <div className={classes}>
                    <span className={spanClassess}></span>
                </div>
            </div>
        </div>
    )
}

HighSpeed.propTypes = {
    highSpeed:PropeTypes.bool.isRequired,
    toggle:PropeTypes.func.isRequired,
}