import { Component } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';


class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        itemEnded: false // св-во, если закончились элементы, чтобы кнопка LoadMore скрывалась
    }

     marvelService = new MarvelService();

    componentDidMount() {
       this.onRequestLoad();
    }

    // метод, когда пользователь кликает на кнопку loadMore
    onRequestLoad = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharecters(offset)
        .then(this.onCharListLoaded)
        .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }


    // загрузились новые данные 
    onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList < 9) {
            ended =  true;
        }

        this.setState(({offset, charList}) => ({ // charList -  это charList из текущего state
            charList: [...charList, ...newCharList ], 
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            itemEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    renderItems(arr) {
        const items =  arr.map((item) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    className="char__item"
                    key={item.id}
                    onClick={()=> this.props.onCharSelected(item.id)}   >
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
     
    render () {
        const {charList, loading, error, newItemLoading, offset, itemEnded} = this.state;
        
        const items = this.renderItems(charList);

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
                onClick={() => this.onRequestLoad(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
} 

export default CharList;