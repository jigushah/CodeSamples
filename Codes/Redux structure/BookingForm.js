import React from 'react';
import {
    Dimensions,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    View,
    ActivityIndicator
} from 'react-native';
//import numeral from 'numeral';
import { connect } from 'react-redux';
import { Components } from 'expo';
import { SlidingTabNavigation, SlidingTabNavigationItem } from '@expo/ex-navigation';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
//import { ListView } from '@shoutem/ui';
import { Container, Content, Grid, Col, Row, List, ListItem, Input } from 'native-base';
//import CreditCardDisplay from '../../components/CreditCardDisplay';
import BackButtonCustom from '../../navigation/BackButtonCustom';
import { addedNote,newBooking } from '../../actions/BookingActions';
import cs from '../../constants/SharedStyles';

const mapStateToProps = state => {
    return {
        location: state.booking.new.confirmed.location,
        timeList: state.booking.timeList,
        vehicle: state.booking.new.confirmed.vehicle,
        bundle: state.booking.new.confirmed.bundle,
        services: state.booking.new.services,
        date: state.booking.new.confirmed.date,
        time: state.booking.new.confirmed.time,
        payment: state.booking.new.confirmed.payment,
        notes: state.booking.new.notes
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addNote: (notes) => dispatch(addedNote(notes)),
        newBooking : (booking) => dispatch(newBooking(booking))
    };
};

const Map = (lat,long) => {
    return(
        <Components.MapView.Marker
            identifier="location"
            coordinate={{
                latitude: lat,
                longitude: long
            }}/>)

}

@connect(mapStateToProps, mapDispatchToProps)
class BookingForm extends React.Component {
    static route = {
        navigationBar: {
            title: 'New Booking',
            backgroundColor: '#fff',
            renderLeft: (route, props) => <BackButtonCustom reset='booking' />
        },
    }
    constructor(props) {
        super(props);
        this.state = {
            displayNotes: false,
        }
    }

    goToLocation = () => {
        this.props.navigation.getNavigator('root').push('location');
    };
    goToVehical = () => {
       if(this.props.location.city){
            this.props.navigation.getNavigator('root').push('bundles');
       }
    };
    goToSchedule = () => {
        if(this.props.location.city && this.props.vehicle.id) {
            this.props.navigation.getNavigator('root').push('schedule');
        }
    };
    goToPayment = () => {
        if(this.props.location.city && this.props.date && this.props.time && this.props.vehicle.id) {
            this.props.navigation.getNavigator('root').push('payment');
        }
    };
    getServices =() => {
        if (this.props.bundle.services){
            const services= this.props.bundle.services.map(function (data) {
                return (
                    <Row>
                      <Text style={[cs.f5, cs.color700]}>
                          {data.name}
                      </Text>
                    </Row>
                )}
            )
        }
    }
    addNotes = () => {

        this.setState({
            displayNotes: !this.state.displayNotes,
        })
    };

    render = () => {

        var d = new Date(this.props.date);
        var options = {
            weekday: "long", year: "numeric", month: "long",
        };
        var formated= d.toLocaleTimeString("en-us", options).split(',')[0];
        var finaldate = formated.split(' ')[2]+" "+formated.split(' ')[0]+" "+formated.split(' ')[1]
        var list = this.props.services;
        var serviceView =Object.keys(list).map(function (key,index) {
           return (
                <Row>
                  <Text style={[cs.f5, cs.color700]}>
                      {list[key].name}
                  </Text>
                </Row>
            )});
        return (
            <View style={cs.container}>
              <ScrollView>
                <View style={[cs.mt1, cs.mb2, cs.pl1, cs.pr1, cs.bg000, cs.shadow1]}>
                  <Grid style={[cs.ml2, cs.mr2]} onPress={this.goToLocation}>
                    <View style={[cs.flxCol]}>
                      <View style={[cs.barVerticalIcon]}>
                        <FontAwesome name='circle-o' size={16} style={(this.props.location.city)?[cs.bg000, cs.colorP5]:[cs.bg000, cs.color500]} />
                      </View>
                      <View style={[cs.flxRow, cs.flx1, cs.barVerticalBottom]}>
                      </View>
                    </View>
                    <Col>
                      <View style={[cs.flxCol, cs.mb2, cs.mt103, cs.ml2]}>
                          {(!this.props.location.address1)?
                              <Row style={[]}>
                                <Text style={[ cs.f5, cs.fw2, cs.color400, cs.u, cs.flx1]}>
                                  Select your Location
                                </Text>
                                <View style={[cs.itemsEnd]}>
                                  <MaterialIcons name='chevron-right' size={18} style={[cs.bg000, cs.color500]} />
                                </View>
                              </Row>
                              :null
                          }
                          {(this.props.location.address1)?
                              <Row>
                                <Text style={[cs.f5, cs.fw4, cs.flx1]}>
                                    {this.props.location.address1}
                                    {this.props.location.address2}
                                </Text>
                                <View style={[cs.itemsEnd]}>
                                  <MaterialIcons name='chevron-right' size={18} style={[cs.bg000, cs.color500]} />
                                </View>
                              </Row>
                              :null
                          }
                          {(this.props.location.city)?
                              <Row>
                                <Text style={[cs.f6, cs.fw4, cs.color600]}>
                                    {this.props.location.city}, {this.props.location.state} {this.props.location.zipcode}
                                </Text>
                              </Row>:null
                          }
                          {(this.props.location && this.props.location.lat)?
                          <View style={[ cs.flx1, cs.height100]}>
                              <Components.MapView
                                  provider='google'
                                  style={[ cs.flx1, cs.height100, cs.radius5, cs.mt1 ]}
                                  showsCompass={false}
                                  ref={ref => { this.map = ref; }}
                                  region={{
                                      latitude: Number(this.props.location.lat),
                                      longitude: Number(this.props.location.long),
                                      latitudeDelta: 0.0222,
                                      longitudeDelta: 0.0121,
                                  }}>
                              {Map(Number(this.props.location.lat), Number(this.props.location.long))}
                              </Components.MapView>
                          </View>:null}
                      </View>
                    </Col>
                  </Grid>
                  <Grid style={[cs.ml2, cs.mr2]} onPress={this.goToVehical}>
                    <View style={[cs.flxCol]}>
                      <View style={[cs.flxRow, cs.flx1, cs.barVerticalTop]}>
                      </View>
                      <View style={[cs.barVerticalIcon]}>
                        <FontAwesome name='circle-o' size={16} style={[cs.bg000, cs.color500]} />
                      </View>
                      <View style={[cs.flxRow, cs.flx1, cs.barVerticalBottom]}>
                      </View>
                    </View>
                    <Col>
                      <View style={[cs.flxCol, cs.mb2, cs.mt103, cs.ml2]}>
                          {(!this.props.vehicle.year)&&
                          <Row style={[]}>
                            <Text style={[ cs.f5, cs.fw2, cs.color400, cs.u, cs.flx1]}>
                              Select your vehicle
                            </Text>
                            <View style={[cs.itemsEnd]}>
                              <MaterialIcons name='chevron-right' size={18} style={[cs.bg000, cs.color500]} />
                            </View>
                          </Row>
                          ||null
                          }
                          {(this.props.vehicle.year)?
                              <Row>
                                <Text style={[cs.f405, cs.flx1]}>
                                    {this.props.vehicle.year} {this.props.vehicle.make} {this.props.vehicle.model}
                                </Text>
                                <View style={[cs.itemsEnd]}>
                                  <MaterialIcons name='chevron-right' size={18} style={[cs.bg000, cs.color500]} />
                                </View>
                              </Row>:null
                          }
                          {(this.props.bundle.name)?
                              <View>
                                <Row>
                                  <Text style={[cs.f5, cs.color700]}>
                                      {this.props.bundle.name}
                                  </Text>
                                </Row>
                                <View>

                                  <View>
                                      {Object.keys(list).map(function (key,index) {
                                          return (
                                              <Row>
                                                <Text style={[cs.f5, cs.color700]}>
                                                    {list[key].name}
                                                </Text>
                                              </Row>
                                          )})}
                                  </View>
                                </View>
                              </View>
                              :
                              null
                          }
                      </View>
                    </Col>
                  </Grid>
                  <Grid style={[cs.ml2, cs.mr2]} onPress={this.goToSchedule}>
                    <View style={[cs.flxCol]}>
                      <View style={[cs.flxRow, cs.flx1, cs.barVerticalTop]}>
                      </View>
                      <View style={[cs.barVerticalIcon]}>
                        <FontAwesome name='circle-o' size={16} style={(this.props.date)?[cs.bg000, cs.colorP5]:[cs.bg000, cs.color500]} />
                      </View>
                      <View style={[cs.flxRow, cs.flx1, cs.barVerticalBottom]}>
                      </View>
                    </View>
                    <Col>
                      <View style={[cs.flxCol, cs.mb2, cs.mt103, cs.ml2]}>
                          {(!this.props.date)?
                            <Row style={[]}>
                              <Text style={[cs.f5, cs.fw2, cs.color400, cs.u, cs.flx1]}>
                                Select a Date &amp; Time
                              </Text>
                              <View style={[cs.itemsEnd]}>
                                <MaterialIcons name='chevron-right' size={18} style={[cs.bg000, cs.color500]} />
                              </View>
                            </Row>
                            :null
                          }
                          {(this.props.date)?
                              <Row style={[]}>
                                {/*<Col size={1}>
                                  <Text>
                                    <FontAwesome name='calendar-o' size={20} color='#feb92c'/>
                                  </Text>
                                </Col>*/}
                                <Text style={[cs.f6, cs.flx1]}>
                                    { this.props.timeList[this.props.time].formatted_start_time} {" - "}{ this.props.timeList[this.props.time].formatted_end_time} {"\n"}
                                    {finaldate}
                                </Text>
                                <View style={[cs.itemsEnd]}>
                                  <MaterialIcons name='chevron-right' size={18} style={[cs.bg000, cs.color500]} />
                                </View>
                              </Row>
                              :null
                          }
                      </View>
                    </Col>
                  </Grid>
                  <Grid style={[cs.ml2, cs.mr2]} onPress={this.goToPayment}>
                    <View style={[cs.flxCol]}>
                      <View style={[cs.flxRow, cs.flx1, cs.barVerticalTop]}>
                      </View>
                      <View style={[cs.barVerticalIcon]}>
                        <FontAwesome name='circle-o' size={16} style={(this.props.payment.last4)?[cs.bg000, cs.colorP5]:[cs.bg000, cs.color500]} />
                      </View>
                    </View>
                    <Col>
                      <View style={[cs.flxCol, cs.mb2, cs.mt103, cs.ml2]}>
                            {(!this.props.payment.last4)?
                              <Row>
                                <Text style={[ cs.f5, cs.fw2, cs.color400, cs.u, cs.flx1]}>
                                  Select a payment method
                                </Text>
                                <View style={[cs.flxCol, cs.mb2, cs.mt103, cs.ml1]}>
                                  <MaterialIcons name='chevron-right' size={18} style={[cs.bg000, cs.color500]} />
                                </View>
                              </Row>
                              :null
                            }
                          {(this.props.payment.last4)?

                              <Row>
                                {/*<Col size={1}>
                                  <Text style={[cs.f6, cs.fw6]}>
                                    <FontAwesome name='credit-card' size={20} color='#40d47e'/>
                                  </Text>
                                </Col>*/}
                                  <Text style={[cs.f6, cs.fw6, cs.flx1]}>
                                    Tip {'\n'} *** {this.props.payment.last4}
                                  </Text>
                                  <View style={[cs.flxCol, cs.mb2, cs.mt103, cs.ml1]}>
                                    <MaterialIcons name='chevron-right' size={18} style={[cs.bg000, cs.color500]} />
                                  </View>
                              </Row>
                              :null
                          }
                      </View>
                    </Col>
                  </Grid>
                  <Grid style={[cs.ml2, cs.mr2]} onPress={this.addNotes}>
                    <View style={[cs.flxCol]}>
                      <View style={[cs.flxRow, cs.flx1, cs.barVerticalTop]}>
                      </View>
                      <View style={[cs.barVerticalIcon]}>
                        <FontAwesome name='circle-o' size={16} style={[cs.bg000, cs.color500]} />
                      </View>
                      <View style={[cs.flxRow, cs.flx1, cs.barVerticalBottom]}>
                      </View>
                    </View>
                    <Col size={9}>
                      <View style={[cs.flxCol, cs.mb2, cs.mt103, cs.ml2]}>
                          <Row style={[]}>
                            <Text style={[cs.f5,cs.fw2,(this.props.notes)? cs.bg000 : cs.color400,cs.u]}>
                              notes
                            </Text>
                          </Row>
                          {(this.state.displayNotes)?
                              <Row>
                                <Input
                                    placeholder="Make a note..."
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    multiline={true}
                                    value={this.props.notes}
                                    onChangeText={(text) =>
                                        this.props.addNote(text)
                                    }
                                    style={[cs.bg200, cs.pl1, cs.mt1, cs.f605, cs.height100]}
                                />
                              </Row>:null
                          }
                      </View>
                    </Col>
                    <Col size={1}>
                      <View style={[cs.flxCol, cs.mb2, cs.mt103, cs.ml1]}>
                        <MaterialIcons name='chevron-right' size={18} style={[cs.bg000, cs.color500]} />
                      </View>
                    </Col>
                  </Grid>
                </View>
              </ScrollView>

              <View style={[]}>
                <TouchableHighlight
                    style={(this.props.payment.last4)?[cs.pl3, cs.pr3, cs.pt1, cs.pb1, cs.bgS4]:[cs.pl3, cs.pr3, cs.pt1, cs.pb1, cs.bg400]}
                    activeOpacity={1}
                    underlayColor={'#40d47e'}
                    onPress={() => {


                        var booking ={
                            "location": 1,
                            "date": this.props.date,
                            "time": this.props.time,
                            "payment": this.props.payment.id,
                            "notes": this.props.notes,
                            "details": [
                                {
                                    "bundle": this.props.bundle.id,
                                    "vehicle": this.props.vehicle.id
                                }
                            ]
                        }

                        this.props.newBooking(booking);


                    }}
                >
                  <Text style={[cs.color000, cs.f5, cs.fw8, cs.tc]}>
                    Complete Booking
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
        );
    }
}

export default BookingForm;
