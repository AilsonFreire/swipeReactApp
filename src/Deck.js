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
        /*Return a object with getLayout first properties
          that returns an object that has information about exactly
          the card should be positioned in the X and Y position
          */
        const { position } = this.state;
        const rotate = position.x.interpolate({
            inputRange: [-500, 0, 500],
            outputRange: ['-120deg', '0deg', '120deg']
        });
        return {
            ...position.getLayout(),
            transform: [{ rotate }]
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
