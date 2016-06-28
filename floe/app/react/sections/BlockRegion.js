class BlockRegion extends React.Component {
    handleClick(id) {
        this.props.remove(id);
    };

    render() {
        return (
            <div className="row">
                <div className="large-8 columns">
                    <div className="block" style={{position: "relative"}}>
                        Block of text
                        <div className="overlay__settings" style={{position: "absolute", top: "25px", right: "25px"}}>
                            <button onClick={this.handleClick.bind(this, this.props.id)}>X</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
;

export default BlockRegion;