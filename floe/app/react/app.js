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
        this.state = { components: [<ImageRegion />, <BlockRegion />] }
    };
    addComponent (element) {
        this.setState(
            { components: this.state.components.concat(element) }
        )
    };

    reset () {
        this.setState(
            { components: [] }
        )
    };
    render () {
        return (
            <div>
                <div className="container">
                    <div className="content">
                        <div className="row">
                            <div className="large-8 columns">
                                <div className="block">
                                    <button onClick={() => this.addComponent(<BlockRegion />)}>Add Block</button>
                                    <button onClick={() => this.addComponent(<ImageRegion />)}>Add Image</button>
                                    <button onClick={() => this.addComponent(<Navigation />)}>Add Navigation</button>
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