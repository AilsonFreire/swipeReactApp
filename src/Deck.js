import React, { Component } from 'react';
import {
    Animated,
    PanResponder,
    View
} from 'react-native';

class Deck extends Component {
    constructor(props) {
        super(props);

        //first question of animation: where is te object tha I want do animante?
        const position = new Animated.ValueXY();
        const panResponder = PanResponder.create({
            /*Function that is executed any time that user taps on screen
              setting it true, it meas that it turns all instance of PanResponse
              to be responsible for the user pressing on the screen*/
            onStartShouldSetPanResponder: () => true,
            /*PanResponde that chatches all the information when user
             starts to drag (move) their fingher arround the screen*/
            onPanResponderMove: (event, gesture) => {
                //Updates that position on Animated.ValeuXY
                position.setValue({ x: gesture.dx, y: gesture.dy });
            },
            /*This is call any time that user press, drag and let it go*/
            onPanResponderRelease: () => { }
        });

        this.state = { panResponder, position };
    }

    getCardStyle() {
        return {
            ...this.state.position.getLayout(),
            transform: [{ rotate: '45deg' }]
        };
    }
    renderCards() {
        return this.props.data.map((item, index) => {
            if (index === 0) {
                return (
                    <Animated.View
                        key={item.id}
                        style={this.getCardStyle()}
                        {...this.state.panResponder.panHandlers}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                );
            }
            return this.props.renderCard(item);
        });
    }

    render() {
        return (
            <View>
                {this.renderCards()}
            </View>
        );
    }
}

export default Deck;
