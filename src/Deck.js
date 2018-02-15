import React, { Component } from 'react';
import {
    Animated,
    PanResponder,
    View,
    Dimensions
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class Deck extends Component {
    static defaultProps = {
        onSwipeRight: () => { },
        onSwipeLeft: () => { }
    }

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
            onPanResponderRelease: (event, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) {
                    this.forceSwipe('right');
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    this.forceSwipe('left');
                } else {
                    this.resetPosition();
                }
            }
        });

        this.state = { panResponder, position, index: 0 };
    }

    onSwipeComplete(direction) {
        const { onSwipeRight, onSwipeLeft, data } = this.props;
        const item = data[this.state.index];

        direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
        this.state.position.setValue({ x: 0, y: 0 });
        this.setState({ index: this.state.index + 1 });
    }

    getCardStyle() {
        /*Return a object with getLayout first properties
          that returns an object that has information about exactly
          the card should be positioned in the X and Y position
          */
        const { position } = this.state;
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 2.0, 0, SCREEN_WIDTH * 2.0],
            outputRange: ['-120deg', '0deg', '120deg']
        });
        return {
            ...position.getLayout(),
            transform: [{ rotate }]
        };
    }
    /* Combinating onPanRelease to animated.spring to set a initial position on the card */
    resetPosition() {
        Animated.spring(this.state.position, {
            toValue: { x: 0, y: 0 }
        }).start();
    }
    /*The same way to above but using timing to set the card out of screen*/
    forceSwipe(direction) {
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
        Animated.timing(this.state.position, {
            toValue: { x, y: 0 },
            duration: SWIPE_OUT_DURATION
        }).start(() => this.onSwipeComplete(direction));
    }

    renderCards() {
        if (this.state.index >= this.props.data.length) return this.props.renderNoMoreCards();
        /*There are two types of index: this.props. and index to refers to index of array 
        comming to map data */
        return this.props.data.map((item, i) => {
            if (i < this.state.index) return null;
            if (i === this.state.index) {
                return (
                    <Animated.View
                        key={item.id}
                        style={[this.getCardStyle(), styles.cardStyle, { zIndex: 100 }]}
                        {...this.state.panResponder.panHandlers}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                );
            }
            return (
                <View
                    key={item.id}
                    style={[styles.cardStyle, { top: 10 * (i - this.state.index), zIndex: 5 }]}
                >
                    {this.props.renderCard(item)}
                </View>
            );
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

const styles = {
    cardStyle: {
        position: 'absolute',
        width: SCREEN_WIDTH,
        zIndex: -1
    }
};

export default Deck;
