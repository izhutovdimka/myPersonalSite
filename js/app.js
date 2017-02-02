{/*пусть будет массив с новостями*/}
var my_news = [{
	author: 'Чак Паланик',
	text: 'Колыбельная',
	description: 'Поначалу новые хозяева делают вид, что не смотрят на пол в гостиной. То есть особенно не приглядываются. Не тогда, когда смотрят дом в первый раз. И не тогда, когда перевозят вещи. Они измеряют комнаты, распоряжаются, куда ставить диваны и пианино, распаковывают коробки, и во всей этой суете у них не находится времени, чтобы посмотреть на пол в гостиной. Они делают вид.'
	},

	{
		author: 'Федор Достоевский',
		text: 'Преступление и наказание',
		description: 'Преступление и наказаниеПреступление и наказаниеПреступление и наказаниеПреступление и наказаниеПреступление и наказаниеПреступление и наказаниеПреступление и наказаниеПреступление и наказаниеПреступление и наказаниеПреступление и наказаниеПреступление и наказаниеПреступление и наказаниеПреступление и наказаниеПреступление и наказаниеПреступление и наказаниеПреступление и наказаниеПреступление и наказание'
	},

	{
		author:'Герберт Уэллс',
		text:'Человек невидимка',
		description: 'Человек невидимкаЧеловек невидимкаЧеловек невидимкаЧеловек невидимкаЧеловек невидимкаЧеловек невидимкаЧеловек невидимкаЧеловек невидимкаЧеловек невидимкаЧеловек невидимкаЧеловек невидимкаЧеловек невидимкаЧеловек невидимкаЧеловек невидимкаЧеловек невидимкаЧеловек невидимкаЧеловек невидимкаЧеловек невидимкаЧеловек невидимкаЧеловек невидимкаЧеловек невидимка'
	},

	{
		author:'Стивен Кинг',
		text: 'Оно',
		description: 'Ужас, продолжавшийся в последующие восемь лет, - да и вообще был ли ему конец?-начался, насколько я могу судить, с кораблика, сделанного из газетного листа и подхваченного дождевым потоком, который унес его вниз по подводному желобу...'
	}
];

//глобальная переменная
window.ee = new EventEmitter();

var Article = React.createClass({
	propTypes: {
		data: React.PropTypes.shape({
			author:React.PropTypes.string.isRequired,
			text:React.PropTypes.string.isRequired,
			description:React.PropTypes.string.isRequired
		})
	},
	getInitialState: function(){
		return{
			visible: false
		};
	},
	//событие клика по ссылке
	readmoreClick: function(e) {
		e.preventDefault();
		this.setState({visible:true});
	},

	render: function(){
		var author = this.props.data.author;
		var text = this.props.data.text;
		var description = this.props.data.description;
		var visible = this.state.visible; //считываем значение из состояния покоя компонента

		

		return(
			<div className="article">
			<p className="news_author">{author}:</p>
			<p className="news_text">{text}</p>

		{/*не показывай ссылку если visible==true*/}
		{/*не верь саблайму, тут все правильно!!!!*/}

			<a href="#" 
			onClick={this.readmoreClick} 
			className={'news_readmore ' + (visible ? 'none':'')}>Подробнее
			</a>

		{/* не показывай текст если visible==false*/}
			<p className={'news_description ' + (visible ? '':'none')}>{description}</p>
			</div>)
	}
});

{/*---------------------------------------------*/}
{/*news*/}

var News = React.createClass({
	propTypes: {
		data: React.PropTypes.array.isRequired
	},

	getInitialState: function(){
		return{
			counter: 0
		};
	},

	render:function(){
		var data =this.props.data;
		var newsTemplate;

		if(data.length > 0){
			newsTemplate = data.map(function(item, index){
			return(<div key={index}>
				<Article data={item}/>
				</div>)
			})
		}else {
			newsTemplate =<p>К сожалению новостей ней</p>
		}

	{/*Если новостей нет то мы задаем стронгу имя класа none-->срабатывает css и strong не виден. Обрати внимание на className-т.к. он принимает строку мы напишем два класса внутри*/}


		return(
		<div className="news">
		{newsTemplate}
		<strong 
			className={'news_count ' + (data.length > 0 ? '':'none')}
			>
			Всего новостей: {data.length}
			</strong>
		</div>);
	}
});


{/*------------------------------------------------*/}
var Add = React.createClass({

	getInitialState: function() {
		return {
			agreeNotChecked: true,
			authorIsEmpty: true,
			textIsEmpty: true
		};
	},

	componentDidMount: function() {
		ReactDOM.findDOMNode(this.refs.author).focus();
	},


	btnClick: function(e) {
		e.preventDefault();
		var textEl = ReactDOM.findDOMNode(this.refs.text);

		var author = ReactDOM.findDOMNode(this.refs.author).value;
		var text = textEl.value;
		
		var item = [{
			author: author,
			text: text,
			description: '...'
		}];

		window.ee.emit('News.add', item);

		{/*очищаем форму после добавления новости*/}
		textEl.value ='';
		this.setState({textIsEmpty: true});
	},

	onCheckRuleClick: function(e) {
		this.setState({agreeNotChecked: !this.state.agreeNotChecked});
		//устанавливаем значение в state
	},

	onFieldChange: function(fieldName, e) {
		if(e.target.value.trim().length > 0){
			this.setState({[''+fieldName]:false})
		}else{
			this.setState({[''+fieldName]: true})
		}
	},

	

	render: function(){
		var agreeNotChecked = this.state.agreeNotChecked;
		var authorIsEmpty = this.state.authorIsEmpty;
		var textIsEmpty = this.state.textIsEmpty;

	return(

	<form className='add cf'>
		<input 
			type='text'
			className='add_author'
			onChange={this.onFieldChange.bind(this, 'authorIsEmpty')}
			placeholder='Ваше имя'
			ref='author'
			required
		/>
		<textarea
			className='add_text'
			onChange={this.onFieldChange.bind(this, 'textIsEmpty')}
			placeholder='Текст новости'
			ref='text'
			required
		></textarea>
		<label className='add_checkrule'>
			<input type='checkbox' ref='checkrule' onChange={this.onCheckRuleClick}/>Я согласен с правилами
		</label>

		<button
			className='add_btn'
			onClick={this.btnClick}
			ref='alert_btn'
			disabled={agreeNotChecked || authorIsEmpty || textIsEmpty}
			>
			Опубликовать новость
		</button>	
	</form>
	);
}
});

var App = React.createClass({
	getInitialState: function(){
		return {
			news: my_news
		};
	},

	componentDidMount: function(){
		var self = this;
		window.ee.addListener('News.add', function(item){
			var nextNews = item.concat(self.state.news);
			self.setState({news:nextNews});
		});
	},

	componentWillUnmount: function(){
		window.ee.removeListener('News.add');
	},


	render: function(){
		console.log('render');
		return (
			<div className="app">
				<Add />
				<div className='news_title'><h1>Новости</h1></div>
				<News data={this.state.news}/> {/*Добавили свойства*/}
				<footer><p>Copyright 2016. Dmitry Izhutov</p></footer>
			</div>
			);
	}
});

ReactDOM.render(<App />, document.getElementById('root'));

