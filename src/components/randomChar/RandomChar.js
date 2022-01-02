import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

// класс для отображения рандомной карточки с персонажем вверху
class RandomChar extends Component {

    state = {
        char: {},
        loading: true,
        error: false
    }

    componentDidMount() {
        this.updateChar(); // вызвали сразу метод
    }

    // экзмемпляр калсса MarvelService, без const, так как не используем конструктор, т.е. это новое св-во внутри класса RandomChar
    marvelService = new MarvelService();

    onCharLoaded = (char) => { // char  это трансформированный обьект из метода getCharecter
        this.setState({char:char, loading: false}) // в ф-ии  _transformCharecter MarvelServes.js мы структурировали обьект до нужного состояния, как только данные загрузились loading приравниваем к false
    }

    onResLoading = () => { // при нажатии на кнопку Try, чтобы спинер появлялся
        this.setState({
            loading: true
        })
    }

    onError = () => { // метод для обработки ошибки
        this.setState({
            loading: false,
            error: true
        })
    }


    // метод, который обращается к сервису и записывает эти данные в state
    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000 ); // 1011400 - максимальный диапазон - минус минимальный диапазон 1011000 id + минус минимальный диапазон 1011000, в реальности уточнять у бэкендеров
        this.onResLoading();
        this.marvelService 
            .getCharecter(id)
            .then(this.onCharLoaded)
            .catch(this.onError); // если ошибка на сервере, то выбрасываем ошибку из метода  onError()
    }


    render() {
        const {char, loading, error} = this.state;  // деструктурировали обьект
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner/> : null ;
        const content = !(loading || error) ? <View char={char} /> : null ;  //есди нет ошибки или нет загрузки, то возвращаем компонент View

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
                        <div className="inner" onClick={this.updateChar}>try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
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