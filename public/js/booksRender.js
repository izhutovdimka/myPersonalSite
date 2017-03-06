//libraryRender.js
var BOOKS = [{
	id: 1,
	name: "Оно",
	author: "Стивен Кинг",
	link: "/data-books/it.pdf"
},
{
	id: 2,
	name: "Десять негритят",
	author: "Агата Кристи",
	link: "/data-books/desyat_negrityat.pdf"
}];

var Book = React.createClass({
        	render: function(){
        		var lnk = this.props.link;
        		return(
        			<li className="book">
        				<div className="book-info">
        					<div className="book-name">{this.props.name}</div>
        					<div className="book-author">{this.props.author}</div>
        					<div className="book-link"><a href={lnk}>Download</a></div>
        				</div>
        			</li>
        		);
        	}
        });
		
		var BooksList = React.createClass({

			Search: function(event){
				//поиск по книгам
				//console.log(event.target.value);
				//поиск 
				var querySearch = event.target.value.toLowerCase();
				var displayedBooks = BOOKS.filter(function(el){
					var searchValue = el.name.toLowerCase();
					return searchValue.indexOf(querySearch) !== -1;
				});

				this.setState({displayedBooks:displayedBooks});
				//console.log(displayedBooks);
			},

			getInitialState: function(){
				return{
					displayedBooks: BOOKS
				}
			},

			render: function(){
				return(
				<div className="books">
					<input type="text" className="search-field" onChange={this.Search}/>
					<ul className="book-list">
						{
							this.state.displayedBooks.map(function(el){
								return <Book 
								key={el.id} 
								name={el.name}
								author={el.author}
								link={el.link}
								/>
							})
						}
					</ul>
				</div>);
			}
		});

		ReactDOM.render(
			<BooksList />,
			document.getElementById('root')
		);