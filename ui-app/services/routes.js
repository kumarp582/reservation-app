import ListReservations from '../components/list-reservations';
import ReservationInfo from '../components/reservation-info';
import CreateReservation from '../components/create-reservation';

export const pathRoutes = [{
    key: "listReservations",
    roles: [],
    defaultPath: '/',
    component: ListReservations,
    icon: "",
    sidebarVisible: true
}, {
    key: "createReservations",
    roles: [],
    defaultPath: '/reservation/create',
    component: CreateReservation,
    icon: "",
    sidebarVisible: true
}, {
    key: "listReservations",
    roles: [],
    defaultPath: '/reservation-details/:reservationId',
    component: ReservationInfo,
    icon: "",
    sidebarVisible: true
}];

export const pathRoutesMap = (() => {
    var map = {};
    pathRoutes.map((route) => {
        map[route.key] = route;
    });
    return map;
})();

export function checkUserRole(path, accessRoles) {
    const pathStr = path.split('/')[1];
    // let checkUserAuth = pathRoutesMap[pathStr]['roles'].filter((role) => {
    //     return true;
    //     //return accessRoles.indexOf(role) >= 0;
    // });
    // if(checkUserAuth.length > 0) {
    //     return true;
    // }
    return true; // change it to return false later
}
