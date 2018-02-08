import React, { Component } from 'react';
import { View, Animated } from 'react-native';

class Ball extends Component {
    componentWillMount() {
        //First question of Animation: where is the object
        this.position = new Animated.ValueXY(0, 0);
        //Second question: where the object should be and the end
        Animated.spring(this.position, {
            toValue: { x: 200, y: 500 }
        }).start();
    }
    render() {
        return (
            {/*Third question of Animation: 
            what object should be animaeted*/},
            <Animated.View style={this.position.getLayout()}>
                <View style={styles.ball} />
            </Animated.View>
        );
    }
}

const styles = {
    ball: {
        height: 60,
        width: 60,
        borderRadius: 30,
        borderWidth: 30,
        borderColor: 'black',
    }
};

export default Ball;
