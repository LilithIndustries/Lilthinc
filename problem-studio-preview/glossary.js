(() => {
  'use strict';

  const TERMS = [
    {id:'decision-rights', label:'decision rights', re:/\bdecision rights\b/i, def:'Who has authority to make a particular decision, who must be consulted, and when that decision is final.'},
    {id:'demand-governance', label:'demand governance', re:/\bdemand governance\b/i, def:'The rules for what work enters the system, who can request it, how it is prioritised, and who can override that order.'},
    {id:'feedback-loop', label:'feedback loop', re:/\bfeedback loops?\b/i, def:'A cycle where the result of an action is fed back into future decisions or behaviour.'},
    {id:'work-in-progress', label:'work in progress', re:/\bwork in progress\b/i, def:'Work that has started but is not yet finished. Too much at once can create queues, switching and delay.'},
    {id:'operating-model', label:'operating model', re:/\boperating models?\b/i, def:'How an organisation actually gets work done: roles, decisions, workflows, information, incentives and routines.'},
    {id:'root-cause', label:'root cause', re:/\broot causes?\b/i, def:'The underlying condition or combination of conditions that produces a recurring problem.'},
    {id:'system-level', label:'system-level', re:/\bsystem[- ]level\b/i, def:'Looking at the behaviour of the whole connected system rather than one team or component in isolation.'},
    {id:'constraint', label:'constraint', re:/\bconstraints?\b/i, def:'The factor that currently limits the outcome or flow of the wider system.'},
    {id:'mechanism', label:'mechanism', re:/\bmechanisms?\b/i, def:'The process or behaviour that could be producing the result you can see.'},
    {id:'intervention', label:'intervention', re:/\binterventions?\b/i, def:'A deliberate change made to try to alter an outcome.'},
    {id:'hypothesis', label:'hypothesis', re:/\bhypoth(?:esis|eses)\b/i, def:'A possible explanation that must be tested against evidence before it is treated as true.'},
    {id:'handoff', label:'handoff', re:/\bhandoffs?\b/i, def:'The point where work, information or responsibility moves from one person, team or system to another.'},
    {id:'triangulation', label:'triangulation', re:/\btriangulat(?:e|ed|es|ing|ion)\b/i, def:'Checking the same question against multiple independent sources or types of evidence.'},
    {id:'bottleneck', label:'bottleneck', re:/\bbottlenecks?\b/i, def:'A point where work is restricted or delayed because capacity or flow is lower than the demand arriving there.'},
    {id:'escalation', label:'escalation', re:/\bescalat(?:e|ed|es|ing|ion|ions)\b/i, def:'Moving a problem or decision to someone with greater authority because it cannot be resolved where it sits.'},
    {id:'dependency', label:'dependency', re:/\bdependenc(?:y|ies)\b/i, def:'Something a task, team or system relies on before it can proceed or work correctly.'},
    {id:'rework', label:'rework', re:/\brework\b/i, def:'Work that has to be repeated, corrected or rebuilt because the first pass did not produce a usable result.'},
    {id:'diagnostic', label:'diagnostic', re:/\bdiagnostic(?:s)?\b/i, def:'A structured investigation used to understand what is happening and what may be causing it before choosing a response.'},
    {id:'pattern', label:'pattern', re:/\bpatterns?\b/i, def:'A repeated shape in events, behaviour or evidence. A pattern is a clue, not proof of a cause.'},
    {id:'workflow', label:'workflow', re:/\bworkflows?\b/i, def:'The real sequence of steps through which work moves from request to completion.'},
    {id:'lens', label:'lens', re:/\blenses?\b/i, def:'A perspective used to examine one part of a problem without assuming that part is the cause.'},
    {id:'flow', label:'flow', re:/\bflow\b/i, def:'How smoothly work moves through a system from start to finish, including where it waits, loops or gets interrupted.'},
    {id:'queue', label:'queue', re:/\bqueues?\b/i, def:'Work that is waiting for attention, a decision, information or capacity before it can continue.'},
    {id:'workaround', label:'workaround', re:/\bworkarounds?\b/i, def:'An informal way of getting work done when the intended process or system does not work well enough.'},
    {id:'trade-off', label:'trade-off', re:/\btrade[- ]offs?\b/i, def:'A choice where improving one thing may require giving up or accepting less of something else.'},
    {id:'incentive', label:'incentive', re:/\bincentives?\b/i, def:'A reward, pressure or consequence that makes one behaviour more rational or attractive than another.'},
    {id:'process', label:'process', re:/\bprocess(?:es)?\b/i, def:'A repeatable set of activities used to produce an outcome.'},
    {id:'capacity', label:'capacity', re:/\bcapacity\b/i, def:'The amount of useful work a person, team or system can realistically handle within a period.'},
    {id:'capability', label:'capability', re:/\bcapabilit(?:y|ies)\b/i, def:'The skill, knowledge, tools and conditions needed to perform a type of work effectively.'},
    {id:'control', label:'control', re:/\bcontrols?\b/i, def:'A check or safeguard designed to reduce error, risk or unwanted variation.'},
    {id:'metric', label:'metric', re:/\bmetrics?\b/i, def:'A measure used to track performance, activity or an outcome. A metric is only useful if it represents the thing you actually care about.'},
    {id:'evidence', label:'evidence', re:/\bevidence\b/i, def:'Information that can support, weaken or disprove an explanation. Evidence is stronger when it can be independently checked.'},
    {id:'signal', label:'signal', re:/\bsignals?\b/i, def:'An observation that may indicate a meaningful change or pattern. A signal is something to investigate, not proof by itself.'},
    {id:'sample', label:'sample', re:/\bsamples?\b/i, def:'A subset of people, cases, events or data examined to learn about a wider situation.'},
    {id:'symptom', label:'symptom', re:/\bsymptoms?\b/i, def:'The visible or experienced problem. The symptom may be real even when its cause sits somewhere else.'},
    {id:'outcome', label:'outcome', re:/\boutcomes?\b/i, def:'The result that matters after the work is done, rather than the activity used to get there.'},
    {id:'exception', label:'exception', re:/\bexceptions?\b/i, def:'A case that is allowed to bypass the usual rule, process or standard.'},
    {id:'system', label:'system', re:/\bsystems?\b/i, def:'A set of connected people, processes, tools, decisions and incentives whose interactions produce an overall result.'}
  ];

  const SKIP = 'a,script,style,code,pre,textarea,input,select,option,button,nav,footer,[data-no-glossary]';
  const linked = new Set();

  function addStyle(){
    if(document.getElementById('glossary-link-style')) return;
    const style=document.createElement('style');
    style.id='glossary-link-style';
    style.textContent=`
      .glossary-term{
        color:inherit;
        text-decoration-line:underline;
        text-decoration-style:dotted;
        text-decoration-thickness:1px;
        text-underline-offset:3px;
        text-decoration-color:rgba(83,110,114,.72);
        cursor:help;
      }
      .glossary-term:hover,
      .glossary-term:focus-visible{
        color:#536e72;
        text-decoration-style:solid;
      }
    `;
    document.head.appendChild(style);
  }

  function eligible(node){
    const p=node.parentElement;
    if(!p || p.closest(SKIP)) return false;
    if(!node.nodeValue || !node.nodeValue.trim()) return false;
    return true;
  }

  function processTextNode(node){
    if(!eligible(node)) return;

    const original=node.nodeValue;
    let remaining=original;
    const frag=document.createDocumentFragment();
    let changed=false;

    while(remaining){
      let matchTerm=null, match=null, earliest=Infinity;

      for(const term of TERMS){
        if(linked.has(term.id)) continue;
        const m=term.re.exec(remaining);
        if(m && m.index < earliest){
          earliest=m.index;
          matchTerm=term;
          match=m;
        }
      }

      if(!matchTerm || !match){
        frag.append(document.createTextNode(remaining));
        break;
      }

      if(match.index>0) frag.append(document.createTextNode(remaining.slice(0,match.index)));

      const found=match[0];
      const a=document.createElement('a');
      a.className='glossary-term';
      a.href='glossary.html#'+matchTerm.id;
      a.title=matchTerm.def;
      a.setAttribute('aria-label', found + ': ' + matchTerm.def + ' Open glossary definition.');
      a.textContent=found;
      frag.append(a);

      linked.add(matchTerm.id);
      changed=true;
      remaining=remaining.slice(match.index+found.length);
    }

    if(changed) node.replaceWith(frag);
  }

  function scan(root=document.body){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];
    let n;
    while((n=walker.nextNode())) nodes.push(n);
    nodes.forEach(processTextNode);
  }

  addStyle();
  if(!document.body.classList.contains('glossary-page')) scan();

  const observer=new MutationObserver(records=>{
    if(document.body.classList.contains('glossary-page')) return;
    for(const record of records){
      for(const node of record.addedNodes){
        if(node.nodeType===Node.TEXT_NODE) processTextNode(node);
        else if(node.nodeType===Node.ELEMENT_NODE && !node.matches(SKIP)) scan(node);
      }
    }
  });
  observer.observe(document.body,{childList:true,subtree:true});
})();