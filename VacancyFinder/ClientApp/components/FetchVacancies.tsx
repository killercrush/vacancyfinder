import * as React from 'react';
import { Link, RouteComponentProps, BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as VacancyState from '../store/Vacancies';

// At runtime, Redux will merge together...
type VacancyProps =
    VacancyState.VacanciesState        // ... state we've requested from the Redux store
    & typeof VacancyState.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{ startPage: string }>; // ... plus incoming routing parameters

class FetchVacanies extends React.Component<VacancyProps, { inputText: string }> {
    constructor() {
        super();
        this.state = { inputText: '' };
    }
    componentWillMount() {
        let startPage = parseInt(this.props.match.params.startPage) || 0;
        this.props.requestVacancies(startPage);
    }

    componentWillReceiveProps(nextProps: VacancyProps) {
        let startPage = parseInt(nextProps.match.params.startPage) || 0;
        this.props.requestVacancies(startPage);
    }

    public render() {
        return <div>
            <h1>Вакансии</h1>
            <p>На этой станице отображен список вакансий</p>
            { this.renderSearchInput() }
            { this.renderVacanciesTable() }
            { this.renderPagination() }
        </div>;
    }

    private renderSearchInput() {
        return <div className="input-group">
            <input className="form-control" placeholder="Ключевые слова..." value={this.state.inputText}
                type="text" onChange={(e) => { this.setState({ inputText: e.target.value }); }} />
                <span className="input-group-btn">
                <button onClick={this.setSearchText} className="btn btn-primary" type="button">Поиск</button>
                </span>
        </div>
    }

    private setSearchText = () => {
        this.props.setSearchText(this.state.inputText);
        this.props.history.push('/fetchvacancies');
    }

    private renderVacanciesTable() {
        if (this.props.vacancies.length == 0 && !this.props.isLoading) {
            return <div className='row'>
                <div className='col-xs-12'>
                    <div className="alert alert-info not-found" role="alert">
                        Запрос не дал результатов
                    </div>
                </div>
            </div>
        }

        return <table className='table'>
            <thead>
                <tr>
                    <th>Должность</th>
                    <th>Работодатель</th>
                    <th>Зарплата</th>
                    <th>Описание</th>
                </tr>
            </thead>
            <tbody>
                {this.props.vacancies.map(vacancy =>
                    <tr key={vacancy.id}>
                        <td><a target='_blank' href={vacancy.url}>{vacancy.title}</a></td>
                        <td>{vacancy.employerName}</td>
                        <td>{vacancy.salary}</td>
                        <td>{vacancy.description}</td>
                    </tr>
            )}
            </tbody>
        </table>;
    }

    private renderPagination() {
        let prevStartPageIndex = (this.props.startPage || 0) - 1;
        let nextStartPageIndex = (this.props.startPage || 0) + 1;

        let prevButton = prevStartPageIndex >= 0 ?
            <Link className='btn btn-default pull-left' to={`/fetchvacancies/${prevStartPageIndex}`}>Назад</Link> : null;
        let nextButton = this.props.hasMorePages ?
            <Link className='btn btn-default pull-right' to={`/fetchvacancies/${nextStartPageIndex}`}>Далее</Link> : null;
        return <p className='clearfix text-center'>
            { prevButton }
            { nextButton }
            { this.props.isLoading ? <span>Загрука...</span> : [] }
        </p>;
    }
}

export default connect(
    (state: ApplicationState) => state.vacancies,
    VacancyState.actionCreators
)(FetchVacanies) as typeof FetchVacanies;
