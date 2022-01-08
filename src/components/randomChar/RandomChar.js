import {useState, useEffect} from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';


// класс для отображения рандомной карточки с персонажем вверху
const RandomChar = () => {
 
    const [char, setChar] = useState(null);
    // достаем сотсояния из нашего кастомного хука
    const {loading, error, getCharecter, clearError} = useMarvelService();

    useEffect(() => {
        updateChar(); // вызвали сразу метод
    }, [])
        

    // загрузка персонажей
   const onCharLoaded = (char) => { // char  это трансформированный обьект из метода getCharecter
        setChar(char) // в ф-ии  _transformCharecter useMarvelServes.js мы структурировали обьект до нужного состояния
    }


    // метод, который обращается к сервису и записывает эти данные в state
    const updateChar = () => {
        clearError();
        const id = Math.floor(Math.random() * (1011400 - 1011000)) + 1011000;
        getCharecter(id)
            .then(onCharLoaded);
    }


        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner/> : null ;
        const content = !(loading || error || !char) ? <View char={char} /> : null ;  //есди нет ошибки или нет загрузки, то возвращаем компонент View

        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main">
                        <div className="inner" onClick={updateChar}>try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }

const View = ({char}) => { //создали компонент для отображения динамических данных, передели в него данные обьекта, т.е. это просто компонент для отображения данных, без логики
    const {name, description, thumbnail, homepage, wiki } = char;

    let imgStyle = {'objectFit' : 'cover'};
    const avalibleImg = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'; // для заглушки картинки доп стили
    if(thumbnail === avalibleImg) {
        imgStyle = {'objectFit' : 'contain'}
    }

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgStyle}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr"> {description}  </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
         </div>
        </div>
    )
    
}

export default RandomChar;