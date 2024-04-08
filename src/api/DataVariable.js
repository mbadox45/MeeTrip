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
            { label: 'SPDK', icon: 'pi pi-fw pi-car',
                items: [
                    { label: 'My SPDK', icon: 'pi pi-fw pi-briefcase', to: '/my-spdk' },
                    { label: 'BTO', icon: 'pi pi-fw pi-car',
                        items: [
                            { label: 'Approve (DP)', icon: 'pi pi-fw pi-bookmark', to: '/bto-spdk' },
                            { label: 'Approve (Assignor / Superior)', icon: 'pi pi-fw pi-bookmark', to: '/approval' },
                            { label: 'Approve (HC)', icon: 'pi pi-fw pi-bookmark', to: '/bto-spdk' },
                        ]
                    },
                    { label: 'BTE', icon: 'pi pi-fw pi-car',
                        items: [
                            { label: 'BTO - Approve (DP)', icon: 'pi pi-fw pi-bookmark', to: '/bto-spdk' },
                            { label: 'BTO - Approve (Assignor)', icon: 'pi pi-fw pi-bookmark', to: '/bto-spdk' },
                            { label: 'BTO - Approve (Superior)', icon: 'pi pi-fw pi-bookmark', to: '/bto-spdk' },
                        ]
                    },
                ]
            },
            { label: 'Meeting Room', icon: 'pi pi-fw pi-tag', 
                items: [
                    {
                        label: 'Master Room',
                        icon: 'pi pi-fw pi-building',
                        to: '/room'
                    },
                    {
                        label: 'Booking',
                        icon: 'pi pi-fw pi-calendar',
                        to: '/booked'
                    },
                ]
            },
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
            { label: 'SPDK', icon: 'pi pi-fw pi-car',
                items: [
                    { label: 'My SPDK', icon: 'pi pi-fw pi-briefcase', to: '/my-spdk' },
                    { label: 'BTO - Approve', icon: 'pi pi-fw pi-bookmark', to: '/bto-spdk' },
                ]
            },
            { label: 'BOM', icon: 'pi pi-fw pi-star', to: '/bom' },
            { label: 'Meeting Room', icon: 'pi pi-fw pi-tag', to: '/booked' },
        ]
    },
]
export const menu_adminsdm_approve = [
    {
        label: 'Home',
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/home' }]
    },
    {
        label: 'Main Menu',
        items: [
            { label: 'SPDK', icon: 'pi pi-fw pi-car',
                items: [
                    { label: 'My SPDK', icon: 'pi pi-fw pi-briefcase', to: '/my-spdk' },
                    { label: 'Approval', icon: 'pi pi-fw pi-check-circle',
                        items: [
                            { label: 'BTO - Approve', icon: 'pi pi-fw pi-bookmark', to: '/bto-spdk' },
                            {
                                label: 'Approval (Assignor)',
                                icon: 'pi pi-fw pi-bookmark',
                                to: '/approval-assignor'
                            },
                            {
                                label: 'Approval (Superior)',
                                icon: 'pi pi-fw pi-bookmark-fill',
                                to: '/approval-superior'
                            },
                    ] },
                ]
            },
            { label: 'BOM', icon: 'pi pi-fw pi-star', to: '/bom' },
            { label: 'Meeting Room', icon: 'pi pi-fw pi-tag', to: '/booked' },
        ]
    },
]
export const menu_adminga = [
    {
        label: 'Home',
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/home' }]
    },
    {
        label: 'SPDK',
        items: [
            { label: 'My SPDK', icon: 'pi pi-fw pi-briefcase', to: '/my-spdk' },
            { label: 'Approval', icon: 'pi pi-fw pi-check-circle',
                items: [
                    // { label: 'Down Payment', icon: 'pi pi-fw pi-dollar', to: '/dp-spdk' },
                    { label: 'Down Payment', icon: 'pi pi-fw pi-dollar', to: '/bto-spdk' },
                    { label: 'BTO', icon: 'pi pi-fw pi-inbox', to: '/surat-jalan' },
                    { label: 'BTE', icon: 'pi pi-fw pi-box', to: '/bte-spdk' },
                    { label: 'Disbursement', icon: 'pi pi-fw pi-money-bill', to: '/disbursement-spdk' },
                ]
            },
            { label: 'All SPDK', icon: 'pi pi-fw pi-list', to: '/all-spdk' },
        ]
    },
    {
        label: 'Meeting Room',
        items: [
            {
                label: 'Master Room',
                icon: 'pi pi-fw pi-building',
                to: '/room'
            },
            {
                label: 'Booking',
                icon: 'pi pi-fw pi-calendar',
                to: '/booked'
            },
        ]
    },
]

export const menu_adminga_approve = [
    {
        label: 'Home',
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/home' }]
    },
    {
        label: 'SPDK',
        items: [
            { label: 'My SPDK', icon: 'pi pi-fw pi-briefcase', to: '/my-spdk' },
            {
                label: 'Approval (Assignor)',
                icon: 'pi pi-fw pi-bookmark',
                to: '/approval-assignor'
            },
            {
                label: 'Approval (Superior)',
                icon: 'pi pi-fw pi-bookmark-fill',
                to: '/approval-superior'
            },
            { label: 'Approval', icon: 'pi pi-fw pi-check-circle',
                items: [
                    { label: 'Down Payment', icon: 'pi pi-fw pi-dollar', to: '/dp-spdk' },
                    { label: 'BTO', icon: 'pi pi-fw pi-bookmark', to: '/bto-spdk' },
                    { label: 'Travel Document', icon: 'pi pi-fw pi-inbox', to: '/surat-jalan' },
                    { label: 'BTE', icon: 'pi pi-fw pi-box', to: '/bte-spdk' },
                    { label: 'Disbursement', icon: 'pi pi-fw pi-money-bill', to: '/disbursement-spdk' },
                ]
            },
            { label: 'All SPDK', icon: 'pi pi-fw pi-list', to: '/all-spdk' },
            // { label: 'SPDK', icon: 'pi pi-fw pi-car',
            //     items: [
            //     ]
            // },
        ]
    },
    {
        label: 'Meeting Room',
        items: [
            {
                label: 'Master Room',
                icon: 'pi pi-fw pi-building',
                to: '/room'
            },
            {
                label: 'Booking',
                icon: 'pi pi-fw pi-calendar',
                to: '/booked'
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
            { label: 'Meeting Room', icon: 'pi pi-fw pi-tag', to:'/booked'
                // items: [
                //     {
                //         label: 'Booked',
                //         icon: 'pi pi-fw pi-calendar',
                //         to: '/booked'
                //     },
                //     {
                //         label: 'My Booking',
                //         icon: 'pi pi-fw pi-book',
                //         to: '/my-booking'
                //     },
                // ]
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
                        label: 'Approval (Assignor)',
                        icon: 'pi pi-fw pi-bookmark',
                        to: '/approval-assignor'
                    },
                    {
                        label: 'Approval (Superior)',
                        icon: 'pi pi-fw pi-bookmark-fill',
                        to: '/approval-superior'
                    },
                ]
            },
            { label: 'Meeting Room', icon: 'pi pi-fw pi-tag', to:'/booked'
                // items: [
                //     {
                //         label: 'Booked',
                //         icon: 'pi pi-fw pi-calendar',
                //         to: '/booked'
                //     },
                //     {
                //         label: 'My Booking',
                //         icon: 'pi pi-fw pi-book',
                //         to: '/my-booking'
                //     },
                // ]
            },
        ]
    },
]