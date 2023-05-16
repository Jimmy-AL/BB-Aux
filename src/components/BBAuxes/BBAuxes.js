import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form"
import Checkbox from '../Input/Checkbox';
import Input from '../Input/Input';
import { DecimalInput } from '../Input/Input';
import { plus10, plus13, augs, aa } from '../Stats/stats'
import Tooltip from '../Tooltip/Tooltip';

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
        var rate = 0.05 + acc / (acc + enemyStats.evasion + 2000) + (luck.total - enemyStats.luck + enemyStats.lvldiff) / 5000 + (critRate + crit.rate) / 100;
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
            if (aux.aux2 !== 'High Performance Fire Control Radar' || aux.aux2 === 'Admiralty Fire Control Table') {
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



    return (<>
    <h1> What auxes should I be using on my battleship?</h1>
    <form onSubmit={handleSubmit(onSubmit)}>
        <div>
            <button type="submit">Evaluate</button>
            <input
                type="button"
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
            ? <FinalResult result={result} other={other}/>
            : <></>
        }
        <div>
            <h2>Attacker Stats</h2>
        </div>
        <div>
            <h3>Firepower</h3>
        </div>
        <div>
            <Input title="Base" type="number" register={register} label="fpBase" valueAsNumber />
            <Input title="Guns" type="number" register={register} label="fpGuns" valueAsNumber />
            <Input title="Fleet Tech" type="number" register={register} label="fpTech" valueAsNumber />
            <Input title="Cats" type="number" register={register} label="fpCats" valueAsNumber />
            <Tooltip text="Example: For a 30% FP buff, enter 30.">
                <DecimalInput title="Buffs" type="number" register={register} label="fpBuffs" valueAsNumber />
            </Tooltip>
        </div>
        <div>
            <h3>Accuracy</h3>
        </div>
        <div>
            <Input title="Base" type="number" register={register} label="accBase" valueAsNumber />
            <Input title="Equips" type="number" register={register} label="accEquips" valueAsNumber />
            <Input title="Fleet Tech" type="number" register={register} label="accTech" valueAsNumber />
            <Input title="Cats" type="number" register={register} label="accCats" valueAsNumber />
            <Tooltip text="For accuracy/hit STAT buffs. Example: For a 30% ACC buff, enter 30.">
                <DecimalInput title="Buffs" type="number" register={register} label="accBuffs" valueAsNumber />
            </Tooltip>
            <Tooltip text="For hit rate buffs like Warspite Retrofit's. For a 10% hit rate buff enter 10.">
                <DecimalInput title="Hit Rate Buffs" type="number" register={register} label="accHitRateBuff" valueAsNumber />
            </Tooltip>
        </div>
        <div>
            <h3>Luck</h3>
        </div>
        <div>
            <Input title="Base" type="number" register={register} label="lckBase" valueAsNumber />
            <Input title="Cats" type="number" register={register} label="lckCats" valueAsNumber />
        </div>
        <div>
            <h3>Critical Hit Buffs</h3>
        </div>
        <div>
            <Tooltip text="For critical rate buffs from skills/cats and NOT auxiliaries. For a 6% crit rate bonus enter 6.">
                <Input title="Rate" type="number" register={register} label="critRate" valueAsNumber />
            </Tooltip>
            <Tooltip text="For critical damage buffs from skills/cats and NOT auxiliaries. For a 30% crit damage bonus enter 30.">
                <Input title="Damage" type="number" register={register} label="critDmg" valueAsNumber />
            </Tooltip>
        </div>
        <div>
            <h2>Enemy Stats</h2>
        </div>
        <div>
            <Input title="Evasion" type="number" register={register} label="enemyEva" valueAsNumber />
            <Input title="Luck" type="number" register={register} label="enemyLck" valueAsNumber />
            <Tooltip text="Difference between attacker level and the enemy's. Example: Your ship is level 125 and the enemy is level 130. Enter -5.">
                <Input title="Level Difference" type="number" register={register} label="enemyLvlDiff" valueAsNumber />
            </Tooltip>
            
        </div>
        <div>
            <h2>
                Special Considerations
            </h2>
        </div>
        <div>
            <Tooltip text="Check to take augments into consideration. For unique augments like Hood's, leave this unchecked and input the stats into the attacker stats section.">
                <Checkbox title= "Augments" register={register} label="augs" />
            </Tooltip>
            <Tooltip text="Check to take STAAG/134mm FP AA into consideration.">
                <Checkbox title= "AA" register={register} label="aa" /> 
            </Tooltip>
            <Tooltip text="Check if HMS ship to take Yellow Shell into consideration">
                <Checkbox title= "HMS" register={register} label="hms" />
            </Tooltip>
            <Tooltip text="Check to take +13 auxes only into consideration.">
                <Checkbox title= "+13" register={register} label="thirteen" />
            </Tooltip>
            <Tooltip text="Check to remove the radars from consideration if the decreased load time is not desirable.">
                <Checkbox title= "Shells only" register={register} label="onlyShells" />
            </Tooltip>
            <Tooltip text="Check to only consider radar set ups if decreased load time is needed.">
                <Checkbox title= "Force HPFCR" register={register} label="forceFCR" />
            </Tooltip>
            <Tooltip text="Check to take the rainbow FCR into consideration. Only limited to 1 currently and will be clog up most set ups if enemy has high enough evasion.">
                <Checkbox title= "Admiralty" register={register} label="admiralty" />
            </Tooltip>
            
        </div>
        {/*<div>
            <button type="submit">Evaluate</button>
            <input
                type="button"
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
        </div>*/}
    </form>
    </>)
}

const FinalResult = ({ result, other }) => {
    if (other.onlyShells && (other.admiralty || other.forceFCR)) {
        return <div>Please use your brain.</div>
    }
    if (!other.augs && !other.aa && !other.hms && other.onlyShells) {
        return <div>Well there's only 1 combination...</div>
    }
    if (other.augs && other.aa) {
        return(
            <div>
                <div>
                    Base mods: FP = {result.base[0]}, Hit Rate = {result.base[1].toFixed(4) * 100}%, Average Damage Increase From Critical Hits = {(result.base[2] * 100 - 100).toFixed(4)}%. Total damage mod = {result.base[3].toFixed(4)}.
                </div>
                <div>
                    The best combination is {result.best[0]}, {result.best[1]}, {result.best[2]}, {result.best[3]} resulting in a {result.best[4].toFixed(2)}% increase over base damage.
                </div>
                <div>
                    The second best combination is {result.second[0]}, {result.second[1]}, {result.second[2]}, {result.second[3]} resulting in a {result.second[4].toFixed(2)}% increase over base damage.
                </div>
                <div>
                    The third best combination is {result.third[0]}, {result.third[1]}, {result.third[2]}, {result.third[3]} resulting in a {result.third[4].toFixed(2)}% increase over base damage.
                </div>
            </div>
        )
    }
    else if (other.augs || other.aa) {
        return (
            <div>
                <div>
                    Base mods: FP = {result.base[0]}, Hit Rate = {result.base[1].toFixed(4) * 100}%, Average Damage Increase From Critical Hits = {(result.base[2] * 100 - 100).toFixed(4)}%. Total damage mod = {result.base[3].toFixed(4)}.
                </div>
                <div>
                    The best combination is {result.best[0]}, {result.best[1]}, {result.best[2]} resulting in a {result.best[3].toFixed(2)}% increase over base damage.
                </div>
                <div>
                    The second best combination is {result.second[0]}, {result.second[1]}, {result.second[2]} resulting in a {result.second[3].toFixed(2)}% increase over base damage.
                </div>
                {result.third[0]
                    ?<div>
                        The third best combination is {result.third[0]}, {result.third[1]}, {result.third[2]} resulting in a {result.third[3].toFixed(2)}% increase over base damage.
                    </div>
                    :<></>}
            </div>
        )
    }
    else {
        return (
        <div>
            <div>
                Base mods: FP = {result.base[0]}, Hit Rate = {(result.base[1] * 100).toFixed(2)}%, Average Damage Increase From Critical Hits = {(result.base[2] * 100 - 100).toFixed(4)}%. Total damage mod = {result.base[3].toFixed(4)}.
            </div>
            <div>
                The best combination is {result.best[0]} with {result.best[1]} resulting in a {result.best[2].toFixed(2)}% increase over base damage.
            </div>
            <div>
                The second best combination is {result.second[0]} with {result.second[1]} resulting in a {result.second[2].toFixed(2)}% increase over base damage.
            </div>
            {result.third[0]
                ?<div>
                    The third best combination is {result.third[0]} with {result.third[1]} resulting in a {result.third[2].toFixed(2)}% increase over base damage.
                </div>
                :<></>}
        </div>
        )
    }
    
}
export default Form