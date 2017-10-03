import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export default class Home extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return <div className="jumbotron">
            <h2>Тестовое задание на вакансию .NET разработчика</h2>
            <hr/>
            <p>При запуске сервера запрашивается 50 вакансий с hh.ru которые сохраняются в БД.</p>
            <p>Затем при запросе от клиента сначала делается попытка получить данные через api hh.ru, если это не удается, то данные берутся из БД</p>
        </div>;
    }
}
