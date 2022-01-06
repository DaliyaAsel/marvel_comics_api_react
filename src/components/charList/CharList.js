import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';


const CharList = (props) => {
    const [charList, setcharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [itemEnded, setItemEnded] = useState(false); // св-во, если закончились элементы, чтобы кнопка LoadMore скрывалась

    const marvelService = new MarvelService();

    useEffect(() => {
        onRequestLoad();
    }, [])  // эта ф-я выполнится только 1 раз, при создании компонента, так как [] зависимость пустая


    // метод, когда пользователь кликает на кнопку loadMore
   const onRequestLoad = (offset) => {
        onCharListLoading();
        marvelService.getAllCharecters(offset)
        .then(onCharListLoaded)
        .catch(onError)
    }

   const onCharListLoading = () => {
        setNewItemLoading(true)
    }


    // загрузились новые данные 
   const onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList < 9) {
            ended =  true;
        }

        setcharList(charList => [...charList, ...newCharList ]); // charList -  это charList из текущего state
        setLoading(loading => false);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setItemEnded(itemEnded => ended);

    }

    const onError = () => {
        setError(true);
        setLoading(loading => true)
    }

    // работа с рефами
    const itemRefs = useRef([]);

    // работа с рефами и добавление класса к ним
   const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        // itemRefs.current[id].focus();

    }

    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
   function renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }

            
            return (
                <li ref = { el => itemRefs.current[i] = el}
                    className="char__item"
                    key={item.id}
                    onClick={()=> { props.onCharSelected(item.id);
                                    focusOnItem(i);
                    }} 
                >
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });
        
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }
     
        const items = renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long"
                style={{'display': itemEnded ? 'none' : 'block'}}
                disabled={newItemLoading}
                onClick={() => onRequestLoad(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }


CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
} 

export default CharList;