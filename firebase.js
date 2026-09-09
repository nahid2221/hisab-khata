const FB_VERSION='12.18.0';
const cfg=window.HISAB_FIREBASE_CONFIG||{};
const configured=!!(cfg.apiKey&&cfg.authDomain&&cfg.projectId&&cfg.appId);
window.HKCloud={configured,user:null,ready:null,auth:null,db:null};
if(!configured){window.HKCloud.ready=Promise.resolve(null)}else{
  window.HKCloud.ready=(async()=>{
    const [{initializeApp},{getAuth,onAuthStateChanged,GoogleAuthProvider,signInWithPopup,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut},{getFirestore,doc,getDoc,setDoc,serverTimestamp}]=await Promise.all([
      import(`https://www.gstatic.com/firebasejs/${FB_VERSION}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${FB_VERSION}/firebase-auth.js`),
      import(`https://www.gstatic.com/firebasejs/${FB_VERSION}/firebase-firestore.js`)
    ]);
    const app=initializeApp(cfg); const auth=getAuth(app); const db=getFirestore(app);
    window.HKCloud.auth=auth; window.HKCloud.db=db;
    window.HKCloud.GoogleAuthProvider=GoogleAuthProvider;
    window.HKCloud.signInWithPopup=signInWithPopup;
    window.HKCloud.signInWithEmailAndPassword=signInWithEmailAndPassword;
    window.HKCloud.createUserWithEmailAndPassword=createUserWithEmailAndPassword;
    window.HKCloud.signOut=signOut;
    window.HKCloud.onAuthStateChanged=onAuthStateChanged;
    window.HKCloud.load=async uid=>{const snap=await getDoc(doc(db,'users',uid,'business','main'));return snap.exists()?snap.data().state:null};
    window.HKCloud.save=async(uid,state)=>setDoc(doc(db,'users',uid,'business','main'),{state,updatedAt:serverTimestamp()},{merge:true});
    onAuthStateChanged(auth,u=>{window.HKCloud.user=u;window.dispatchEvent(new CustomEvent('hk-auth',{detail:u}))});
    return app;
  })().catch(err=>{console.error(err);window.HKCloud.error=err;return null});
}
