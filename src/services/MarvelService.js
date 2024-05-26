import { useHttp } from '../hooks/http.hook';

const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp();

    const  _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=16205229202dd6ae0472422579060448';
    const _baseOffset = 210; // базовый отступ для персонажей


    // запрос к async ofset = _baseOffset это по умолчанию, если не передали другого аргумента в ф-ю, т.е для большей гибкости
   const getAllCharecters = async (ofset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${ofset}&${_apiKey}`);
        return res.data.results.map( _transformCharacter );
    }

    // запрос для получения одного персонажа
   const getCharecter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`); //получаем один обьект и передаем его в _transformCharecter
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async (offset = 0) => {
        const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getComics = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

    // метод для вычленения данных для рандомных карточек сверху и с боку
    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension, // сконкатенировалии строку, так как картинка состоит из 2х св-тв
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || 'There is no description',
            pageCount: comics.pageCount ? `${comics.pageCount} p.` : 'No information about the number of pages',
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            language: comics.textObjects.language || 'en-us',
            price: comics.prices.price ? `${comics.prices.price}$` : 'not available'
        }
    }

    return {loading, error, clearError, getAllCharecters, getCharecter, getAllComics, getComics}
}

export default useMarvelService;