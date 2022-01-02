// {Component} не импортируем, так как здесь чистый js
class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=16205229202dd6ae0472422579060448';

    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status} `)
        }

        return await res.json();
    }

    // запрос к async
    getAllCharecters = async () => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
        return res.data.results.map(this. _transformCharecter);
    }

    // запрос для получения одного персонажа
    getCharecter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`); //получаем один обьект и передаем его в _transformCharecter
        return this._transformCharecter(res.data.results[0]);
    }

    // метод для вычленения данных для рандомных карточек сверху и с боку
    _transformCharecter = (res) => { // res пришел большой обьект, а вернется только с теми св-ми, которые нам нужны, т.е мы вычленяем только нужные св-ва
        return {
            id: res.id,
            name: res.name,
            description: res.description ? `${res.description.slice(0, 200)}... `: 'There is no description for this character',
            thumbnail: res.thumbnail.path + '.' + res.thumbnail.extension, //сконкатенировали строку, так как картинка состоит из 2х свойств
            homepage: res.urls[0].url,  
            wiki: res.urls[1].url, 
            comics: res.comics.items
        }
    }
}

export default MarvelService;