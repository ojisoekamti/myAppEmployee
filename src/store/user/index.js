import firebase from '../../firebase/config'

export const addUser = async (name,email,uid) => {
    try {
        return await firebase
        .database()
        .ref('users/', + uid)
        .set({
            name:name,
            email:email,
            uuid:uid
        })
    } catch (error) {
        
    }
}