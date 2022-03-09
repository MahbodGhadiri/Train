
function Page404(){

    return (
        <div>
            <meta charSet="utf-8" />
            <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#000000" />
            {/*
        imports
        */}
            <link rel="stylesheet" type="text/css" href="/css/style.css" />
            <link rel="stylesheet" type="text/css" href="/css/ReactToastify.css" />
            <link rel="stylesheet" type="text/css" href="/css/font-awesome.min.css" />
            <title>Train App</title>
            <div style={{width: '100%', height: '30vh'}}>
            <div style={{fontFamily: 'Verdana, Geneva, Tahoma, sans-serif', width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div style={{textAlign: 'center', fontSize: 'large', color: 'black', backdropFilter: 'blur(25px) saturate(187%)', WebkitBackdropFilter: 'blur(25px) saturate(187%)', backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '15px', border: '1px solid rgba(209, 213, 219, 0.3)', padding: '3vh 5vh', paddingTop: 0}}>
                <h1 style={{color: 'rgb(0, 0, 0)', fontSize: '500%', textAlign: 'center', marginBottom: 0}}> 404 </h1>
                <h1 style={{fontWeight: 300, textAlign: 'center'}}>
                    صفحه یافت نشد
                </h1>
                <p style={{fontWeight: 100, textAlign: 'center', width: '90vh'}}>
                    صفحه مورد نظر وجود ندارد و یا پاک شده است
                </p>
                </div>
            </div>
            </div>
        </div>
    );

}

export default Page404;