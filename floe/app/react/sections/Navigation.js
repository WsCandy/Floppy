import Options from '../ui/Options';

class Navigation extends React.Component {

    constructor() {
        super();
        this.state = {
            defaults: {}
        }
    };

    removeElement(id) {
        this.props.remove(id);
    };

    updateState(e) {
        this.setState({
            defaults: {}
        })
    };

    render() {
        return (
            <div className="row">
                <div className="large-12 columns">
                    <div className="block" style={{position: "relative"}}>
                        <nav>
                            <ul style={{padding: 0}}>
                                <li style={{display: 'inline-block', marginRight: '20px'}}><a>Home</a></li>
                                <li style={{display: 'inline-block', marginRight: '20px'}}><a>About</a></li>
                                <li style={{display: 'inline-block', marginRight: '20px'}}><a>Why us</a></li>
                                <li style={{display: 'inline-block', marginRight: '20px'}}><a>Contact</a></li>
                            </ul>
                        </nav>
                        <Options remove={this.removeElement.bind(this)}
                                 id={this.props.id}
                                 defaults={this.state.defaults}
                                 update={this.updateState.bind(this)}
                        />
                    </div>
                </div>
            </div>

        )
    }
}
;

export default Navigation;