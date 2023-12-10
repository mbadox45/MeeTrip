import moment from "moment/moment"
const date_now = moment().format('DD-MM-YYYY')
const date_ago =  moment().subtract(10, 'days').format('DD-MM-YYYY');

export const APP_NAME = 'MeeTRIP';

// Data Menu
export const menu_superadmin = [
    {
        label: 'Home',
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/home' }]
    },
    {
        label: 'Main Menu',
        items: [
            { label: 'Pemberi Tugas', icon: 'pi pi-fw pi-tag', to: '/assignor-list' },
            { label: 'SDM', icon: 'pi pi-fw pi-tag', to: '/sdm-list' },
            { label: 'Atasan', icon: 'pi pi-fw pi-tag', to: '/atasan-list' },
            { label: 'Log', icon: 'pi pi-fw pi-history', to: '/log-list' },
        ]
    },
]
export const menu_adminsdm = [
    {
        label: 'Home',
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/home' }]
    },
    {
        label: 'Main Menu',
        items: [
            { label: 'Pemberi Tugas', icon: 'pi pi-fw pi-tag', to: '/assignor-list' },
            { label: 'SDM', icon: 'pi pi-fw pi-tag', to: '/sdm-list' },
            { label: 'Atasan', icon: 'pi pi-fw pi-tag', to: '/atasan-list' },
            { label: 'Log', icon: 'pi pi-fw pi-history', to: '/log-list' },
        ]
    },
]
export const menu_adminga = [
    {
        label: 'Home',
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/home' }]
    },
    {
        label: 'Main Menu',
        items: [
            { label: 'SPDK', icon: 'pi pi-fw pi-car',
                items: [
                    {
                        label: 'BTO - Approve',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/bto-spdk'
                    },
                ]
            },
            { label: 'Form Request', icon: 'pi pi-fw pi-book',
                items: [
                    {
                        label: 'Request - Approve',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/approve-request'
                    },
                    {
                        label: 'Request - To Do',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/todo-request'
                    },
                ]
            },
        ]
    },
]
export const menu_admincnb = [
    {
        label: 'Home',
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/home' }]
    },
    {
        label: 'Main Menu',
        items: [
            { label: 'Payment', icon: 'pi pi-fw pi-money-bill',
                items: [
                    {
                        label: 'Not Yet Paid List',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/not-paid'
                    },
                    {
                        label: 'Paid List',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/paid'
                    },
                ]
            },
            { label: 'SPDK', icon: 'pi pi-fw pi-money-bill',
                items: [
                    {
                        label: 'Approval',
                        icon: 'pi pi-fw pi-check-circle',
                        to: '/approve-cnb'
                    },
                    {
                        label: 'Canceled',
                        icon: 'pi pi-fw pi-ban',
                        to: '/canceled-cnb'
                    },
                ]
            },
            { label: 'Log', icon: 'pi pi-fw pi-history', to: '/log-list' },
        ]
    },
]
export const menu_admincs = [
    {
        label: 'Home',
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/home' }]
    },
    {
        label: 'Main Menu',
        items: [
            { label: 'Meeting Room', icon: 'pi pi-fw pi-tag', 
                items: [
                    {
                        label: 'Booked',
                        icon: 'pi pi-fw pi-calendar',
                        to: '/booked'
                    },
                    {
                        label: 'Past Booking',
                        icon: 'pi pi-fw pi-book',
                        to: '/past-booking'
                    },
                    {
                        label: 'Canceled',
                        icon: 'pi pi-fw pi-book',
                        to: '/canceled-booking'
                    },
                ]
            },
        ]
    },
]
export const menu_user = [
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/home' }]
    },
    {
        label: 'Main Menu',
        items: [
            { label: 'My SPDK', icon: 'pi pi-fw pi-car', to: '/my-spdk' },
            { label: 'Meeting Room', icon: 'pi pi-fw pi-tag', 
                items: [
                    {
                        label: 'Booked',
                        icon: 'pi pi-fw pi-calendar',
                        to: '/booked'
                    },
                    {
                        label: 'My Booking',
                        icon: 'pi pi-fw pi-book',
                        to: '/my-booking'
                    },
                ]
            },
        ]
    },
]
export const menu_user_approve = [
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/home' }]
    },
    {
        label: 'Main Menu',
        items: [
            { label: 'SPDK', icon: 'pi pi-fw pi-car',
                items: [
                    {
                        label: 'My SPDK',
                        icon: 'pi pi-fw pi-briefcase',
                        to: '/my-spdk'
                    },
                    {
                        label: 'Approval',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/approval'
                    },
                ]
            },
            { label: 'Meeting Room', icon: 'pi pi-fw pi-tag', 
                items: [
                    {
                        label: 'Booked',
                        icon: 'pi pi-fw pi-calendar',
                        to: '/booked'
                    },
                    {
                        label: 'My Booking',
                        icon: 'pi pi-fw pi-book',
                        to: '/my-booking'
                    },
                ]
            },
        ]
    },
]