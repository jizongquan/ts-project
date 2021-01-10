import React,{
    useState,
    useCallback,
    useMemo,
    useEffect,
    memo
} from 'react';
import './CitySelector.css';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const CityItem = memo(function CityItem(props){
    const {
        name,
        onSelect
    } = props

    return(
        <li className="city-li" onClick={()=>{onSelect(name)}}>
            {name}
        </li>
    )
})

CityItem.propTypes = {
    name:PropTypes.string.isRequired,
    onSelect:PropTypes.func.isRequired
}

const CitySection = memo(function CitySection(props){
    const {
        title,
        cities=[],
        onSelect
    } = props

    return(
        <ul className="city-ul">
            <li className="city-li" key="title" data-cate={title}>
                {title}
            </li>
            {
                cities.map((city)=>{
                    return(
                        <CityItem
                            key={city.name}
                            name={city.name}
                            onSelect={onSelect}
                        />
                    )
                })
            }
        </ul>
    )
})

CitySection.propTypes = {
    title:PropTypes.string.isRequired,
    cities:PropTypes.array,
    onSelect:PropTypes.func.isRequired
}

const AlphaIndex = memo((props)=>{
    const {
        alpha,
        onClick
    } = props;

    return(
        <i className="city-index-item" onClick={()=>{onClick(alpha)}}>
            {alpha}
        </i>
    )
})

AlphaIndex.propTypes = {
    alpha:PropTypes.string.isRequired,
    onClick:PropTypes.func.isRequired
}

//遍历26个字母，字母从fromCharCode(65)开始
const alphabet = Array.from(new Array(26),(ele,index)=>{
    return String.fromCharCode(65 + index);
})
const CityList = memo(function CityList(props){
    const {
        sections,
        onSelect,
        toAlpha
    } = props

    return(
        <div className="city-list">
            <div className="city-cate">
                {
                    sections.map((section)=>{
                        return(
                            <CitySection
                                key={section.title}
                                title={section.title}
                                cities={section.citys}
                                onSelect={onSelect}
                            />
                        )
                    })
                }
            </div>
            <div className="city-index">
                {
                    alphabet.map((alpha)=>{
                        return(
                            <AlphaIndex onClick={toAlpha} key={alpha} alpha={alpha}/>
                        )
                    })
                }

            </div>
        </div>
    )
})

CityList.propTypes = {
    sections:PropTypes.array.isRequired,
    onSelect:PropTypes.func.isRequired,
    toAlpha:PropTypes.func.isRequired
}

const SuggestItem = memo((props)=>{
    const {
        name,
        onClick
    } = props

    return(
        <li className="city-suggest-li" onClick={(()=>{onClick(name)})}>
            {name}
        </li>
    )
})

SuggestItem.propTypes = {
    name:PropTypes.string.isRequired,
    onClick:PropTypes.func.isRequired
};

const Suggest = memo((props)=>{
    const {
        searchKey,
        onSelect
    } = props;

    const [result,setResult] = useState([])

    useEffect(()=>{
        fetch('/rest/search?key='+ encodeURIComponent(searchKey))
        .then((res)=>{
            return res.json()
        })
        .then((data)=>{
            const {
                result,
                searchKey:sKey
            } = data
            if(sKey === searchKey){
                setResult(result)
            }
        })
    },[searchKey])

    // 等同于下面的写法
    // const fallBackResult = result.length ? result:[{display:searchKey}]

    const fallBackResult = useMemo(()=>{
        if(!result.length){
            return [{
                display:searchKey
            }]
        }
        return result;
    },[result,searchKey])
    return(
        <div className="city-suggest">
            <ul className="city-suggest-ul">
                {
                    fallBackResult.map((item)=>{
                        return(
                            <SuggestItem
                                key={item.display}
                                name={item.display}
                                onClick={onSelect}
                            />
                        )
                    })
                }
            </ul>
        </div>
    )
})

Suggest.propTypes = {
    searchKey:PropTypes.string.isRequired,
    onSelect:PropTypes.func.isRequired
}

const CitySelector = memo(function CitySelector(props){
    const {
        show,
        cityData,
        isLoading,
        onBack,
        fetchCityData,
        onSelect
    } = props;
    const [searchKey,setSearchKey] = useState('')

    const toAlpha =useCallback((alpha) =>{
        document.querySelector(`[data-cate='${alpha}']`)
            .scrollIntoView()
    },[])

    const key = useMemo(()=>{return searchKey.trim()},[searchKey]);
    
    useEffect(()=>{
        if(!show || cityData || isLoading){
            return
        }
        fetchCityData()
    },[show,cityData,isLoading])

    const classes = classnames('city-selector',{
        hidden:!show
    })
    const hideCha = classnames('search-clean',{
        hidden:key.length === 0,
    })

    const outputCitySections = ()=>{
        if(isLoading){
            return <div>loading</div>
        }
        if(cityData){
            return(
                <CityList
                    sections={cityData.cityList}
                    onSelect={onSelect}
                    toAlpha={toAlpha}
                />
            )
        }
        return <div>error</div>
    }

    return(
        <div className={classes}>
            <div className="city-search">
                <div className="search-back" onClick={()=>{onBack()}}>
                    <svg width="42" height="42">
                        <polyline
                            points="25,13 16,21 25,29"
                            stroke="#fff"
                            strokeWidth="2"
                            fill="none"
                        />
                    </svg>
                </div>
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        value={searchKey}
                        className="search-input"
                        placeholder="城市、车站的中文或拼音"
                        onChange={(e)=>{setSearchKey(e.target.value)}}
                     />
                </div>
                <i 
                onClick={()=>{setSearchKey('')}}
                className={hideCha}>
                    &#xf063;
                </i>
            </div>
            {
                Boolean(key) && (
                    <Suggest
                        searchKey={key}
                        onSelect={(key)=>{onSelect(key)}}
                    />
                )
            }
            {outputCitySections()}
        </div>
    )
})

CitySelector.propTypes = {
    show:PropTypes.bool.isRequired,
    cityData:PropTypes.object,
    isLoading:PropTypes.bool.isRequired,
    onBack:PropTypes.func.isRequired,
    fetchCityData:PropTypes.func.isRequired,
    onSelect:PropTypes.func.isRequired
}

export default CitySelector;