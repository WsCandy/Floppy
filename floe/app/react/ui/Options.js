class Options extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaults: {
                content: this.props.defaults.content,
                align: this.props.defaults.align,
                url: this.props.defaults.url,
                width: this.props.defaults.width,
                height: this.props.defaults.height
            },
            properties: {
                content: this.props.defaults.content,
                align: this.props.defaults.align,
                url: this.props.defaults.url,
                width: this.props.defaults.width,
                height: this.props.defaults.height
            },
            modal: 'none'
        }
    };

    removeElement(id) {
        this.props.remove(id);
    };

    openModal() {
        this.setState({
            modal: this.state.modal == 'none' ? 'block' : 'none'
        });
    }

    updateText(e) {
        this.setState({
            properties: {
                content: e.target.value || this.state.defaults.content,
                align: this.state.properties.align,
                url: this.state.properties.url,
                width: this.state.properties.width,
                height: this.state.properties.height
            }
        }, () => {
            this.props.update(this.state.properties);
        });
    }

    updateAlign(e) {
        this.setState({
            properties: {
                content: this.state.properties.content,
                align: e.target.value,
                url: this.state.properties.url,
                width: this.state.properties.width,
                height: this.state.properties.height
            }
        }, () => {
            this.props.update(this.state.properties);
        });
    };

    updateUrl(e) {
        this.setState({
            properties: {
                content: this.state.properties.content,
                url: e.target.value || this.state.defaults.url,
                width: this.state.properties.width,
                height: this.state.properties.height
            }
        }, () => {
            this.props.update(this.state.properties);
        });
    }

    updateWidth(e) {
        this.setState({
            properties: {
                content: this.state.properties.content,
                url: this.state.properties.url,
                width: e.target.value || this.state.defaults.width,
                height: this.state.properties.height
            }
        }, () => {
            this.props.update(this.state.properties);
        });
    }

    updateHeight(e) {
        this.setState({
            properties: {
                content: this.state.properties.content,
                url: this.state.properties.url,
                width: this.state.properties.width,
                height: e.target.value || this.state.defaults.height
            }
        }, () => {
            this.props.update(this.state.properties);

        });
    }

    render() {

        return (
            <div>
                <div className="modal__panel">
                    <button className="btn  btn--static  modal__panel--close"
                            onClick={this.removeElement.bind(this, this.props.id)}>x
                    </button>
                    <button className="btn  btn--static  modal__panel--options"
                            onClick={this.openModal.bind(this)}><i className="icon icon-cog"></i></button>
                </div>
                <div className="modal__settings" style={{display: this.state.modal }}>
                    <span style={{display: this.state.defaults.content ? 'block' : 'none'}}><label>Content</label><input
                        type="text" onChange={this.updateText.bind(this)}/><br /></span>
                    <span style={{display: this.state.defaults.align ? 'block' : 'none'}}><label>Text Align</label>
                        <select onChange={this.updateAlign.bind(this)}>
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option></select>
                    </span>
                    <span style={{display: this.state.defaults.url ? 'block' : 'none'}}><label>Url</label><input
                        type="text" onChange={this.updateUrl.bind(this)}/><br /></span>
                    <span style={{display: this.state.defaults.width ? 'block' : 'none'}}><label>Width</label><input
                        type="text" onChange={this.updateWidth.bind(this)}/><br /></span>
                    <span style={{display: this.state.defaults.height ? 'block' : 'none'}}><label>Height</label><input
                        type="text" onChange={this.updateHeight.bind(this)}/><br /></span>
                </div>
            </div>

        )
    }
}
;

export default Options;