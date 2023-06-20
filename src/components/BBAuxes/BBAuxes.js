import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form"
import Checkbox from '../Input/Checkbox';
import Input from '../Input/Input';
import { DecimalInput } from '../Input/Input';
import { plus10, plus13, augs, aa } from '../Stats/stats'

const Form = () => {
    const { register, handleSubmit, reset, formState: { errors }} = useForm();

    const [firepower, setFirepower] = useState({base: 0, guns: 0, tech: 0, cats: 0, buffs: 0, total: 0});
    const [accuracy, setAccuracy] = useState({base: 0, equips: 0, tech: 0, cats: 0, buffs: 0, hitBuff: 0, total: 0});
    const [luck, setLuck] = useState({base: 0, cats: 0, total: 0});
    const [crit, setCrit] = useState({rate: 0, dmg: 0});
    const [enemyStats, setEnemyStats] = useState({evasion: 0, luck: 0, lvldiff: 0});
    const [other, setOther] = useState({augs: false, aa: false, hms: false, thirteen: false, onlyShells: false, forceFCR: false, admiralty: false});
    const [result, setResult] = useState({base: [], best: [], second: [], third: []});
    const [evaluate, setEvaluate] = useState(0);
    const [final, setFinal] = useState({calc: 0, result: 0});



    // damage formulae
    const fpMod = equipTotal => ((100 + (firepower.total + equipTotal) * ((100 + firepower.buffs) / 100)) / 100);
    const hitRate = (equipTotal) => {
        var acc = (accuracy.total + equipTotal) * (100 + accuracy.buffs) / 100;

        return Math.min(1, (0.1 + acc / (acc + enemyStats.evasion + 2) + (luck.total - enemyStats.luck - enemyStats.lvldiff) / 1000 + accuracy.hitBuff / 100));
    }
    const critBit = (equipAcc, critRate, critDmg) => {
        var acc = (accuracy.total + equipAcc) * (100 + accuracy.buffs) / 100;
        
        // critRate and critDmg are stats from auxes, crit.rate and crit.dmg are the crit rate and damage buffs from the ships inputted by user
        var rate = Math.min(1, 0.05 + acc / (acc + enemyStats.evasion + 2000) + (luck.total - enemyStats.luck + enemyStats.lvldiff) / 5000 + (critRate + crit.rate) / 100);
        return (1 - rate) + rate * ((150 + critDmg + crit.dmg) / 100);
    }
    const validCombo = (aux) => {
        if (!other.hms) {
            if (aux.aux1 === 'Yellow Shell' || aux.aux2 === 'Yellow Shell') {
                return false;
            }
        }
        if (other.onlyShells) {
            if (aux.aux2 === 'High Performance Fire Control Radar' || aux.aux2 === 'Admiralty Fire Control Table') {
                return false;
            }
        }
        if (other.forceFCR) {
            if (aux.aux2 !== 'High Performance Fire Control Radar' && aux.aux2 !== 'Admiralty Fire Control Table') {
                console.log(aux.aux2)
                return false;
            }
        }
        if (!other.admiralty) {
            if (aux.aux2 === 'Admiralty Fire Control Table') {
                return false;
            }
        }
        return true;
    }

    const finalCalcs = () => {
        var auxes = {};
        var calcs = {};
        var dmg = [];
        if (other.thirteen ===  false) {
            auxes = plus10;
        }
        else {
            auxes = plus13;
        }
        
        auxes.map(aux => {
            if (validCombo(aux)) {
                if (other.augs && other.aa) {
                    augs.map(aug => {
                        aa.map(aaGun => {
                            (calcs[fpMod(aux.fp + aug.fp + aaGun.fp) * hitRate(aux.acc + aug.acc + aaGun.acc) * critBit(aux.acc, aux.crate, aux.cdmg)]
                            = {aux1: aux.aux1, aux2: aux.aux2, aug: aug.aug, aa: aaGun.aa})
                        })
                    })
                }
                else if (other.augs) {
                    augs.map(aug => {
                        (calcs[fpMod(aux.fp + aug.fp) * hitRate(aux.acc + aug.acc) * critBit(aux.acc, aux.crate, aux.cdmg)]
                        = {aux1: aux.aux1, aux2: aux.aux2, aug: aug.aug})
                    })
                }
                else if (other.aa) {
                    aa.map(aaGun => {
                        (calcs[fpMod(aux.fp + aaGun.fp) * hitRate(aux.acc + aaGun.acc) * critBit(aux.acc, aux.crate, aux.cdmg)]
                        = {aux1: aux.aux1, aux2: aux.aux2, aa: aaGun.aa})
                    })
                }
                else {
                    calcs[fpMod(aux.fp) * hitRate(aux.acc) * critBit(aux.acc, aux.crate, aux.cdmg)] = {
                        aux1: aux.aux1,
                        aux2: aux.aux2, 
                    }
                }
            }
        })

        dmg = Object.keys(calcs);
        dmg.sort();
        dmg.reverse();
        var third = false;

        if (dmg.length > 1) {
            if (other.augs && other.aa) {
                setResult({
                    ...result, 
                    best: [calcs[dmg[0]].aux1, calcs[dmg[0]].aux2, calcs[dmg[0]].aug, calcs[dmg[0]].aa, dmg[0] / result.base[3] * 100 - 100],
                    second: [calcs[dmg[1]].aux1, calcs[dmg[1]].aux2, calcs[dmg[1]].aug, calcs[dmg[1]].aa, dmg[1] / result.base[3] * 100 - 100],
                    third: [calcs[dmg[2]].aux1, calcs[dmg[2]].aux2, calcs[dmg[2] ].aug, calcs[dmg[2] ].aa, dmg[2] / result.base[3] * 100 - 100]
                })
            }
            else if (other.augs) {
                if (dmg.length >= 3) {
                    third = [calcs[dmg[2]].aux1, calcs[dmg[2]].aux2, calcs[dmg[2] ].aug, dmg[2] / result.base[3] * 100 - 100];
                }
                setResult({
                    ...result, 
                    best: [calcs[dmg[0]].aux1, calcs[dmg[0]].aux2, calcs[dmg[0] ].aug, dmg[0] / result.base[3] * 100 - 100],
                    second: [calcs[dmg[1]].aux1, calcs[dmg[1]].aux2, calcs[dmg[1] ].aug, dmg[1] / result.base[3] * 100 - 100],
                    third: third
                })
            }
            else if (other.aa) {
                if (dmg.length >= 3) {
                    third = [calcs[dmg[2]].aux1, calcs[dmg[2]].aux2, calcs[dmg[2] ].aa, dmg[2] / result.base[3] * 100 - 100];
                }
                setResult({
                    ...result, 
                    best: [calcs[dmg[0]].aux1, calcs[dmg[0]].aux2, calcs[dmg[0] ].aa, dmg[0] / result.base[3] * 100 - 100],
                    second: [calcs[dmg[1]].aux1, calcs[dmg[1]].aux2, calcs[dmg[1] ].aa, dmg[1] / result.base[3] * 100 - 100],
                    third: third
                })
            }
            else {
                if (dmg.length >= 3) {
                    third = [calcs[dmg[2]].aux1, calcs[dmg[2]].aux2, dmg[2] / result.base[3] * 100 - 100];
                }
                setResult({
                    ...result, 
                    best: [calcs[dmg[0]].aux1, calcs[dmg[0]].aux2, dmg[0] / result.base[3] * 100 - 100],
                    second: [calcs[dmg[1]].aux1, calcs[dmg[1]].aux2, dmg[1] / result.base[3] * 100 - 100],
                    third: third
                })
            }
        }
    }

    
    
    const onSubmit = data => {
        Object.keys(data).map(key => {
            if (isNaN(data[key])) {
                data[key] = 0;
            }
        });
        setFinal({...final, result: 0, calc: 0})
        setFirepower({
            base: data.fpBase, 
            guns: data.fpGuns, 
            tech: data.fpTech, 
            cats: data.fpCats, 
            buffs: data.fpBuffs, 
            total: data.fpGuns + data.fpCats + data.fpTech + data.fpBase
        });
        setAccuracy({
            base: data.accBase, 
            equips: data.accEquips, 
            tech: data.accTech, 
            cats: data.accCats, 
            buffs: data.accBuffs, 
            hitBuff: data.accHitRateBuff, 
            total: data.accBase + data.accEquips + data.accTech + data.accCats
        });
        setLuck({
            base: data.lckBase, 
            cats: data.lckCats, 
            total: data.lckBase + data.lckCats
        });
        setCrit({rate: data.critRate, dmg: data.critDmg});
        setEnemyStats({evasion: data.enemyEva, luck: data.enemyLck, lvldiff: data.enemyLvlDiff});
        setOther({...other, augs: data.augs, aa: data.aa, hms: data.hms, thirteen: data.thirteen, onlyShells: data.onlyShells, forceFCR: data.forceFCR, admiralty: data.admiralty});
        setResult({base: [], best: [], second: [], third: []});
        setEvaluate(evaluate + 1);
    }

    // calc base
    useEffect( () => {
        if (evaluate) {
            var f = fpMod(0);
            var h = hitRate(0);
            var c = critBit(0, 0, 0);
            var m = f * c * h;
            setResult({...result, base: [f, h, c, m]});
            setFinal({...final, calc: final.calc + 1});
        }
    }, [evaluate]);

    useEffect(() => {
        if (final.calc > 0) {
            finalCalcs();
            setFinal({...final, result: final.result + 1})
        }
    }, [final.calc])



    return (<div className='text-neutral-100'>
    <div id="h1-container" className='container flex justify-start my-10'>
        <h1 id="main-header" className="text-6xl font-bold outline-text"> What auxes should I be using on my battleship?</h1>
    </div>
    <form onSubmit={handleSubmit(onSubmit)}>
        
        <div className='container flex justify-start my-10 '>
            <h2 className='outline-text'>Attacker Stats</h2>
        </div>
        <div className='container flex justify-start my-5 border-top'>
            <h3>Firepower</h3>
        </div>
        <div className='container grid grid-cols-8 justify-start '>
            <Input title="Base" type="number" register={register} label="fpBase" valueAsNumber errors={errors} hint={false}/>
            <Input errors={errors} title="Guns" type="number" register={register} label="fpGuns" valueAsNumber hint={false}/>
            <Input errors={errors} title="Fleet Tech" type="number" register={register} label="fpTech" valueAsNumber hint={false}/>
            <Input errors={errors} title="Cats" type="number" register={register} label="fpCats" valueAsNumber />
            <DecimalInput errors={errors} title="Buffs" type="number" register={register} label="fpBuffs" valueAsNumber hint={true} message="Example: For a 30% FP buff, enter 30."/>
        </div>
        <div className='container flex justify-start my-5 border-top'>
            <h3>Accuracy</h3>
        </div>
        <div className='container grid grid-cols-8 justify-start'>
            <Input errors={errors} title="Base" type="number" register={register} label="accBase" valueAsNumber hint={false}/>
            <Input errors={errors} title="Equips" type="number" register={register} label="accEquips" valueAsNumber hint={false}/>
            <Input errors={errors} title="Fleet Tech" type="number" register={register} label="accTech" valueAsNumber hint={false}/>
            <Input errors={errors} title="Cats" type="number" register={register} label="accCats" valueAsNumber hint={false}/>
            <DecimalInput errors={errors} title="Buffs" type="number" register={register} label="accBuffs" valueAsNumber hint={true} message="For accuracy/hit STAT buffs. &#10;Example: For a 30% ACC buff, enter 30."/>
            <DecimalInput errors={errors} title="Hit Rate Buffs" type="number" register={register} label="accHitRateBuff" valueAsNumber hint={true} message="For hit rate buffs like Warspite Retrofit's. For a 10% hit rate buff enter 10."/>
        </div>
        <div className='container flex justify-start my-5 border-top'>
            <h3>Luck</h3>
        </div>
        <div className='container grid grid-cols-8 justify-start'>
            <Input errors={errors} title="Base" type="number" register={register} label="lckBase" valueAsNumber hint={false}/>
            <Input errors={errors} title="Cats" type="number" register={register} label="lckCats" valueAsNumber hint={false}/>
        </div>
        <div className='container flex justify-start my-5 border-top'>
            <h3>Critical Hit Buffs</h3>
        </div>
        <div className='container grid grid-cols-8 justify-start'>
            <Input errors={errors} title="Rate" type="number" register={register} label="critRate" valueAsNumber hint={true} message="For critical rate buffs from skills/cats and NOT auxiliaries. For a 6% crit rate bonus enter 6."/>
            <Input errors={errors} title="Damage" type="number" register={register} label="critDmg" valueAsNumber hint={true} message="For critical damage buffs from skills/cats and NOT auxiliaries. For a 30% crit damage bonus enter 30."/>
        </div>
        <div className='container flex justify-start mt-10 mb-5 outline-text border-top'>
            <h2>Enemy Stats</h2>
        </div>
        <div className='container grid grid-cols-8 justify-start'>
            <Input errors={errors} title="Evasion" type="number" register={register} label="enemyEva" valueAsNumber hint={false}/>
            <Input errors={errors} title="Luck" type="number" register={register} label="enemyLck" valueAsNumber hint={false}/>
            <Input errors={errors} title="Level Difference" type="number" register={register} label="enemyLvlDiff" valueAsNumber hint={true} message="Difference between attacker level and the enemy's. Example: Your ship is level 125 and the enemy is level 130. Enter -5."/>
            
        </div>
        <div className='container flex justify-start my-10 mb-5 outline-text border-top'>
            <h2>
                Special Considerations
            </h2>
        </div>
        <div className='container grid grid-cols-10 justify-start mb-10'>
                <Checkbox title= "Augments" register={register} label="augs" message="Check to take augments into consideration. For unique augments like Hood's, leave this unchecked and input the stats into the attacker stats section."/>
                <Checkbox title= "AA" register={register} label="aa" message="Check to take STAAG/134mm FP AA into consideration." /> 
                <Checkbox title= "HMS" register={register} label="hms" message="Check if HMS ship to take Yellow Shell into consideration." />
                <Checkbox title= "+13" register={register} label="thirteen" message="Check to take +13 auxes only into consideration." />
                <Checkbox title= "Shells only" register={register} label="onlyShells" message="Check to remove the radars from consideration if the decreased load time is not desirable."/>
                <Checkbox title= "Force HPFCR" register={register} label="forceFCR" message="Check to only consider radar set ups if decreased load time is needed." />
                <Checkbox title= "Admiralty" register={register} label="admiralty" message="Check to take the Adminralty FCR into consideration."/>
        </div>
        <div>
            
        </div>
        <div id='btn-container' className="container flex text-2xl text-black justify-start space-x-20 mb-10">
            <button id="evaluate" type="submit" className='shadow-2xl shadow-indigo-900  py-1 px-2  border border-black rounded-md bg-neutral-100'>Evaluate</button>
            <input
                id="reset"
                type="button"
                className='shadow-2xl shadow-indigo-900  py-1 px-2 border-solid border border-black rounded-md bg-neutral-100 hover:cursor-pointer'
                onClick={() =>
                    reset(
                        {
                            accBase: '',
                            accEquips: '',
                            accBuffs: '',
                            accCats: '',
                            accHitRateBuff: '',
                            accTech: '',
                            critDmg: '',
                            critRate: '',
                            enemyEva: '',
                            enemyLck: '',
                            enemyLvlDiff: '',
                            fpBase: '',
                            fpBuffs: '',
                            fpCats: '',
                            fpGuns: '',
                            fpTech: '',
                            lckBase: '',
                            lckCats: '',
                            augs: false,
                            aa: false,
                            hms: false,
                            thirteen: false,
                            onlyShells: false,
                            forceFCR: false, 
                            admiralty: false,
                        },
                        setEvaluate(0),
                        setFinal({calc: 0, result: 0})
                    )
                }
                value="Reset"
            />
        </div>
        { final.result > 0
            ? <>
                <div className='container flex mb-5 text-lg error-message'>
                    Base mods: FP = {result.base[0]}, Hit Rate = {result.base[1].toFixed(4) * 100}%, Average Damage Increase From Critical Hits = {(result.base[2] * 100 - 100).toFixed(4)}%. Total damage mod = {result.base[3].toFixed(4)}.
                </div>
                <Result result={result} other={other}/>
                {/*<FinalResult result={result} other={other}/>*/}
            </>
            : <div className="p-64"></div>
        }
    </form>
    <footer className='pt-10 pb-20 border-top'>
        <div className='container flex text-xl'>
            <p>
                <h3>Results are generated by the following steps: </h3>
                <br/>1. Calculate firepower mod, hit rate, and critical modifier based on stats from user input. Multiply all 3 to get total damage mod.
                <br/>2. Calculate the same mod with the stats of every valid combination of auxiliiaries/AA/augments.
                <br/>3. Return the top 3 highest results.
                <br/>* Crit skills from shells are considered, but Bowgun/Officer's Sword skills are not.
            </p>
        </div>
    </footer>
    </div>)
}



const Result = ({ result, other }) => {
    const images = {
        'White Shell': 'https://azurlane.netojuu.com/images/4/43/600.png',
        'Black Shell': 'https://azurlane.netojuu.com/images/thumb/8/8a/620.png/128px-620.png',
        'High Performance Fire Control Radar': 'https://azurlane.netojuu.com/images/3/3e/1260.png',
        'Admiralty Fire Control Table': 'https://azurlane.netojuu.com/images/c/c4/3580.png',
        'Yellow Shell': 'https://azurlane.netojuu.com/images/b/bf/1060.png',
        'Bowgun': 'https://azurlane.netojuu.com/images/9/90/1060200.png',
        'Officer\'s sword': 'https://azurlane.netojuu.com/images/7/77/1060100.png',
        'FP AA': 'https://azurlane.netojuu.com/images/thumb/b/bf/21500.png/128px-21500.png',
        'STAAG': 'https://azurlane.netojuu.com/images/1/18/26600.png',
    }


    // only black shell and white shell
    if (other.onlyShells && (other.admiralty || other.forceFCR)) {
        return <div className='container flex mb-error justify-start content-start text-xl'>
                <div className='error-message'>Shells only cannot be selected with radars.</div>
            </div>
    }

    if (!other.augs && !other.aa && !other.hms && other.onlyShells) {
        return <div className='container grid grid-cols-10 grid-rows-3 gap-10 place-items-center mb-10'>
            <p className='container flex justify-start text-3xl font-bold'>
                BEST:
            </p>
            <div className='ssr'>
                <img alt='aux' className='object-scale-down h-30 w-30' src={images['Black Shell']}/>
            </div>
            <div className='ssr'>
                <img alt='aux' className='object-scale-down h-30 w-30' src={images['White Shell']}/>
            </div>
        </div>
    }


    return <div className='container grid grid-cols-10 grid-rows-3 gap-10 place-items-center mb-10'>
        <div className='container flex flex-col justify-start '>
            <p className='text-3xl font-bold'>BEST:</p>
            <div className='increase-message'>
                {other.augs && other.aa 
                    ? <p>{result.best[4].toFixed(2)}% increase over base.</p> 
                    : other.augs || other.aa
                        ? <p>{result.best[3].toFixed(2)}% increase over base.</p>
                        : <p>{result.best[2].toFixed(2)}% increase over base.
                        {console.log(other.augs || other.aa)}</p>
                }
            </div>
        </div>
        <div className='ssr'>
            <img alt='aux' className='object-scale-down h-30 w-30' src={images[result.best[0]]}/>
        </div>

        {result.best[1] === 'Admiralty Fire Control Table'
            ?<>
                <div className='ur'>
                    <img alt='aux' className='object-scale-down h-30 w-30' src={images[result.best[1]]}/>
                </div>
            </>
            :<>
                <div className='ssr'>
                    <img alt='aux' className='object-scale-down h-30 w-30' src={images[result.best[1]]}/>
                </div>
            </>
        }

        {other.augs && other.aa
            ?<>
            <div className='ssr'>
                <img alt='aux' className='object-scale-down h-30 w-30' src={images[result.best[3]]}/>
            </div>
            <div className='sr'>
                <img alt='aux' className='object-scale-down h-30 w-30' src={images[result.best[2]]}/>
            </div>
            </>
            : other.augs || other.aa
                ? other.augs
                    ? <div className='sr'>
                        <img alt='aux' className='object-scale-down h-30 w-30' src={images[result.best[2]]}/>
                    </div>
                    : <div className='ssr'>
                        <img alt='aux' className='object-scale-down h-30 w-30' src={images[result.best[2]]}/>
                    </div>
                :<></>
        }

        <div className='container flex flex-col justify-start row-start-2'>
            <p className='text-3xl font-bold'>SECOND:</p>
            <div className='increase-message'>
                {other.augs && other.aa 
                ? <p>{result.second[4].toFixed(2)}% increase over base.</p> 
                : other.augs || other.aa
                    ? <p>{result.second[3].toFixed(2)}% increase over base.</p>
                    : <p>{result.second[2].toFixed(2)}% increase over base.</p>
            }</div>
            
        </div>
        <div className='ssr row-start-2'>
            <img alt='aux' className='object-scale-down h-30 w-30' src={images[result.second[0]]}/>
        </div>

        {result.second[1] === 'Admiralty Fire Control Table'
            ? <>
                <div className='ur row-start-2'>
                    <img alt='aux' className='object-scale-down h-30 w-30' src={images[result.second[1]]}/>
                </div>
            </>
            : <>
                <div className='ssr row-start-2'>
                    <img alt='aux' className='object-scale-down h-30 w-30' src={images[result.second[1]]}/>
                </div>
            </>}

        {other.augs && other.aa
        ?<>
        <div className='ssr row-start-2'>
            <img alt='aux' className='object-scale-down h-30 w-30' src={images[result.second[3]]}/>
        </div>
        <div className='sr row-start-2'>
            <img alt='aux' className='object-scale-down h-30 w-30' src={images[result.second[2]]}/>
        </div>
        </>
        : other.augs || other.aa
            ? other.augs
                ? <div className='sr row-start-2'>
                    <img alt='aux' className='object-scale-down h-30 w-30' src={images[result.second[2]]}/>
                </div>
                : <div className='ssr row-start-2'>
                    <img alt='aux' className='object-scale-down h-30 w-30' src={images[result.second[2]]}/>
                </div>
            :<></>
        }

        {result.third[0]
            ?<>
                <div className='container flex flex-col justify-start row-start-3'>
                    <p className='text-3xl font-bold '>THIRD:</p>
                    <div className='increase-message'>{other.augs && other.aa 
                        ? <p>{result.third[4].toFixed(2)}% increase over base.</p> 
                        : other.augs || other.aa
                            ? <p>{result.third[3].toFixed(2)}% increase over base.</p>
                            : <p>{result.third[2].toFixed(2)}% increase over base.</p>
                    }</div>
                    
                </div>
                <div className='ssr row-start-3'>
                    <img alt='aux' className='object-scale-down h-30 w-30' src={images[result.third[0]]}/>
                </div>
                {result.third[1] === 'Admiralty Fire Control Table'
                    ? <>
                        <div className='ur row-start-3'>
                            <img alt='aux' className='object-scale-down h-30 w-30' src={images[result.third[1]]}/>
                        </div>
                    </>
                    : <>
                        <div className='ssr row-start-3'>
                            <img alt='aux' className='object-scale-down h-30 w-30' src={images[result.third[1]]}/>
                        </div>
                    </>}
                {other.augs && other.aa
                    ?<>
                    <div className='ssr row-start-3'>
                        <img alt='aux' className='object-scale-down h-30 w-30' src={images[result.third[3]]}/>
                    </div>
                    <div className='sr row-start-3'>
                        <img alt='aux' className='object-scale-down h-30 w-30' src={images[result.third[2]]}/>
                    </div>
                    </>
                    : other.augs || other.aa
                        ? other.augs
                            ? <div className='sr row-start-3'>
                                <img alt='aux' className='object-scale-down h-30 w-30' src={images[result.third[2]]}/>
                            </div>
                            : <div className='ssr row-start-3'>
                                <img alt='aux' className='object-scale-down h-30 w-30' src={images[result.third[2]]}/>
                            </div>
                        :<></>
                }
            </>
            :<></>}
    </div>
}



export default Form