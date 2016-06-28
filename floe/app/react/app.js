import BlockRegion from './sections/BlockRegion';
import ImageRegion from './sections/ImageRegion';
import Navigation from './sections/Navigation';

class ConstructorFrame extends React.Component {
    render () {
        var components = this.props.components;
        return (
            <div className="content">
                {components}
            </div>
        );
    }
};

class Main extends React.Component {
    constructor () {
        super();
        this.state = { components: [], id: 0 }
    };
    addComponent (element) {
        this.setState(
            {
                components: this.state.components.concat(element),
                id: parseInt(this.state.id) + 1
            }
        )
    };
    reset () {
        var emptyComponents = this.state.components.slice();
            for (var i = 0; i < emptyComponents.length; i++) {
                emptyComponents[i] = null;
            }
        this.setState(
            { components: emptyComponents }
        )
    };
    removeComponent (id) {
        var removedComponents = this.state.components.slice();
        removedComponents[id] = null;
        this.setState(
            { components: removedComponents }
        );
    };
    render () {
        return (
            <div>
                <div className="container">
                    <div className="content">
                        <div className="row">
                            <div className="large-8 columns">
                                <div className="block">
                                    <button onClick={() => this.addComponent(<BlockRegion id={this.state.id} remove={this.removeComponent.bind(this)} />)}>Add Block</button>
                                    <button onClick={() => this.addComponent(<ImageRegion id={this.state.id} remove={this.removeComponent.bind(this)} />)} >Add Image</button>
                                    <button onClick={() => this.addComponent(<Navigation id={this.state.id} remove={this.removeComponent.bind(this)} />)}>Add Navigation</button>
                                    <button onClick={() => this.reset()}>Reset</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <ConstructorFrame components={this.state.components} />
                </div>
            </div>
        )
    }
};

var root = document.getElementById('constructor');

ReactDOM.render(<Main />, root);